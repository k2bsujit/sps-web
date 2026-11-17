// One-off: builds og-default.png and apple-touch-icon.png from SVG. Run: node scripts/make-images.mjs
import sharp from 'sharp'
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#0C1240"/><circle cx="1010" cy="140" r="260" fill="#FF6801" opacity=".25"/><circle cx="1010" cy="140" r="150" fill="#FF6801"/><text x="80" y="250" font-family="Archivo, Arial, sans-serif" font-weight="900" font-size="88" fill="#fff">Rooftop solar with</text><text x="80" y="350" font-family="Archivo, Arial, sans-serif" font-weight="900" font-size="88" fill="#FF6801">up to ₹1,38,000</text><text x="80" y="440" font-family="Archivo, Arial, sans-serif" font-weight="900" font-size="88" fill="#fff">subsidy</text><text x="80" y="550" font-family="Inter, Arial, sans-serif" font-weight="700" font-size="34" fill="#CDD3EE">SP Surya · Nilagiri, Balasore · Free home survey</text></svg>`
await sharp(Buffer.from(og)).png().toFile('public/images/og-default.png')
await sharp('public/favicon.svg', {density: 600}).resize(180, 180).png().toFile('public/apple-touch-icon.png')
console.log('done')
