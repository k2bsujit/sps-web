<?php
/**
 * SP Surya – enquiry form handler (runs on Hostinger).
 * 1. Checks the form, blocks spam.
 * 2. Saves the lead in the admin (Sanity → "Leads").
 * 3. Emails you a copy.
 * 4. Keeps a backup line in leads-backup.csv (outside public_html) in case anything fails.
 *
 * Secrets live in sps-config.php, one folder ABOVE public_html (never in Git).
 * Copy api/config.sample.php there and fill it in.
 */

declare(strict_types=1);

$configPaths = [dirname(__DIR__, 2) . '/sps-config.php', __DIR__ . '/config.php'];
$config = null;
foreach ($configPaths as $p) {
    if (is_file($p)) { $config = require $p; break; }
}

$wantsJson = stripos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false;

function respond(bool $ok, string $error = '', int $code = 200): void {
    global $wantsJson;
    if ($wantsJson) {
        http_response_code($ok ? 200 : $code);
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store');
        echo json_encode(['ok' => $ok, 'error' => $error]);
    } else {
        header('Location: ' . ($ok ? '/thank-you' : '/contact?error=1#enquiry'), true, 303);
    }
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') respond(false, 'Method not allowed', 405);

// Only accept posts from our own site
$host = $_SERVER['HTTP_HOST'] ?? '';
$origin = $_SERVER['HTTP_ORIGIN'] ?? ($_SERVER['HTTP_REFERER'] ?? '');
if ($origin && parse_url($origin, PHP_URL_HOST) !== $host) respond(false, 'Bad origin', 403);

// Honeypot: real people never fill this hidden field
if (!empty($_POST['company'])) respond(true);

$clean = static fn($k, $max = 120) => trim(mb_substr(strip_tags((string)($_POST[$k] ?? '')), 0, $max));
$name     = $clean('name', 80);
$phoneRaw = $clean('phone', 20);
$place    = $clean('place', 80);
$solarFor = $clean('solarFor', 60);
$bill     = $clean('bill', 40);
$message  = $clean('message', 1000);
$page     = $clean('page', 120);

$phone = preg_replace('/\D/', '', $phoneRaw);
if (strlen($phone) === 12 && str_starts_with($phone, '91')) $phone = substr($phone, 2);
if ($name === '' || $place === '' || !preg_match('/^[6-9]\d{9}$/', $phone)) respond(false, 'Please check your name, mobile number and village.', 422);

// Simple rate limit: max 5 submissions per IP per hour
$ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? ($_SERVER['REMOTE_ADDR'] ?? 'x');
$ip = trim(explode(',', $ip)[0]);
$rlFile = sys_get_temp_dir() . '/sps-rl-' . md5($ip);
$hits = array_filter(is_file($rlFile) ? (array)json_decode((string)file_get_contents($rlFile), true) : [], fn($t) => $t > time() - 3600);
if (count($hits) >= 5) respond(false, 'Too many requests. Please call us instead.', 429);
$hits[] = time();
@file_put_contents($rlFile, json_encode(array_values($hits)));

$now = gmdate('c');
$lead = [
    '_type' => 'lead',
    'status' => 'new',
    'name' => $name,
    'phone' => '+91 ' . $phone,
    'place' => $place,
    'solarFor' => $solarFor,
    'bill' => $bill,
    'message' => $message,
    'page' => $page,
    'submittedAt' => $now,
];

$saved = false;
$mailed = false;

// 1) Backup line (outside public_html, so it is never downloadable)
$backup = dirname(__DIR__, 2) . '/leads-backup.csv';
if ($fh = @fopen($backup, 'a')) {
    fputcsv($fh, [$now, $name, $phone, $place, $solarFor, $bill, str_replace(["\r", "\n"], ' ', $message), $page]);
    fclose($fh);
    $saved = true;
}

// 2) Save in Sanity
if ($config && !empty($config['sanity_project_id']) && !empty($config['sanity_token']) && function_exists('curl_init')) {
    $url = sprintf('https://%s.api.sanity.io/v2025-01-01/data/mutate/%s', $config['sanity_project_id'], $config['sanity_dataset'] ?? 'production');
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 10,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'Authorization: Bearer ' . $config['sanity_token']],
        CURLOPT_POSTFIELDS => json_encode(['mutations' => [['create' => $lead]]]),
    ]);
    $res = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($code >= 200 && $code < 300) $saved = true;
    else error_log('[sps-lead] Sanity save failed: HTTP ' . $code . ' ' . substr((string)$res, 0, 300));
}

// 3) Email notification
if ($config && !empty($config['notify_email'])) {
    $from = $config['from_email'] ?? ('no-reply@' . preg_replace('/^www\./', '', $host));
    $subject = "New solar enquiry: $name, $place";
    $body = "New enquiry from the website\n\n"
        . "Name: $name\nMobile: +91 $phone\nVillage/town: $place\nSolar for: $solarFor\nMonthly bill: $bill\n"
        . "Message: $message\nPage: $page\nTime (UTC): $now\n\n"
        . "Call: tel:+91$phone\nWhatsApp: https://wa.me/91$phone\n";
    $headers = "From: SP Surya Website <$from>\r\nContent-Type: text/plain; charset=UTF-8\r\n";
    $mailed = @mail($config['notify_email'], '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, $headers);
}

respond($saved || $mailed, $saved || $mailed ? '' : 'Could not save', 500);
