const fs = require('fs');
try {
    const content = fs.readFileSync('server_error.log', 'utf16le');
    fs.writeFileSync('server_error_utf8_v2.log', content, 'utf8');
    console.log('Conversion successful. File: server_error_utf8_v2.log');
} catch (e) {
    console.error('Conversion failed:', e);
}
