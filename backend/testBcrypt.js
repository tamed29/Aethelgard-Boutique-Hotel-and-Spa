const bcrypt = require('bcryptjs');

async function testBcrypt() {
    try {
        console.log('Testing bcryptjs...');
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('testPassword', salt);
        console.log('Hash:', hash);
        const match = await bcrypt.compare('testPassword', hash);
        console.log('Match:', match);
    } catch (err) {
        console.error('Bcrypt test failed:', err);
    }
}

testBcrypt();
