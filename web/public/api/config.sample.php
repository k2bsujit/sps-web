<?php
/**
 * DO NOT put real values in this file.
 * Copy it to ONE FOLDER ABOVE public_html as  sps-config.php  (Hostinger → File Manager),
 * then fill in the values there. That location is not reachable from the web.
 */
return [
    // Sanity → manage → your project → API → Tokens → "Add API token" (permission: Editor)
    'sanity_project_id' => 'your-project-id',
    'sanity_dataset'    => 'production',
    'sanity_token'      => 'paste-editor-token-here',

    // Where new enquiries are emailed
    'notify_email' => 'you@example.com',
    // Sender address — create it in Hostinger → Emails (e.g. no-reply@your-domain.in) for best delivery
    'from_email'   => 'no-reply@your-domain.in',
];
