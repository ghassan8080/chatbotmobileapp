const fs = require('fs');
const path = require('path');

// 1x1 transparent PNG base64
const pngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
const buffer = Buffer.from(pngBase64, 'base64');

const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir);
}

fs.writeFileSync(path.join(assetsDir, 'icon.png'), buffer);
fs.writeFileSync(path.join(assetsDir, 'splash.png'), buffer);
fs.writeFileSync(path.join(assetsDir, 'adaptive-icon.png'), buffer);
fs.writeFileSync(path.join(assetsDir, 'favicon.png'), buffer);

console.log("Placeholder assets created successfully.");
