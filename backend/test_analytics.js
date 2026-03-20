const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.JWT_SECRET || 'supersecret_aethelgard';
const token = jwt.sign({ userId: 'admin-001', role: 'admin' }, secret, { expiresIn: '1h' });

console.log('Generated Token:', token);

async function testAnalytics() {
    try {
        const response = await fetch('http://localhost:5000/api/admin/analytics', {
            headers: {
                'Cookie': `jwt=${token}`
            }
        });
        
        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Test Error:', error);
    }
}

testAnalytics();
