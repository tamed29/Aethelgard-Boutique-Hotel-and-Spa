async function verify() {
    const API_URL = 'http://127.0.0.1:5000/api';
    const bookingData = {
        roomType: 'forest',
        checkIn: new Date().toISOString(),
        checkOut: new Date(Date.now() + 86400000 * 2).toISOString(),
        guestName: 'Verification Guest',
        guestEmail: 'verify@example.com',
        guests: 2,
        addons: ['champagne']
    };

    try {
        console.log('Sending booking request to ' + API_URL + '...');
        const res = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });
        
        const data = await res.json();
        if (!res.ok) {
            console.error('Booking failed:', data);
            process.exit(1);
        }
        
        console.log('Booking successful:', data.success);
        console.log('Booking ID:', data.booking._id);
        
        console.log('Creation verified correctly.');
        process.exit(0);

    } catch (err) {
        console.error('Verification failed:', err.message);
        process.exit(1);
    }
}

verify();
