async function testGallery() {
    try {
        const response = await fetch('http://localhost:5000/api/gallery');
        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response Count:', Array.isArray(data) ? data.length : 'Not an array');
    } catch (error) {
        console.error('Test Error:', error);
    }
}

testGallery();
