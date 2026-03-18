const nodemailer = require('nodemailer');

const createTransporter = async () => {
    // For development, we'll use ethereal email if no real credentials are provided
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        let testAccount = await nodemailer.createTestAccount();
        return nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });
    }

    // Production configuration (e.g., SendGrid)
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_PORT == 465,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

const sendBookingConfirmation = async (booking, user, room) => {
    try {
        const transporter = await createTransporter();
        const info = await transporter.sendMail({
            from: '"Aethelgard Boutique Hotel & Spa" <reservations@aethelgard.com>',
            to: user.email,
            subject: "Booking Confirmation - Aethelgard",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #4a5d23;">Your reservation is confirmed!</h2>
                    <p>Dear ${user.name || 'Guest'},</p>
                    <p>Thank you for choosing Aethelgard Boutique Hotel & Spa.</p>
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3>Booking Details</h3>
                        <p><strong>Room:</strong> ${room.name}</p>
                        <p><strong>Check-in:</strong> ${new Date(booking.checkIn).toLocaleDateString()}</p>
                        <p><strong>Check-out:</strong> ${new Date(booking.checkOut).toLocaleDateString()}</p>
                        <p><strong>Total Price:</strong> $${booking.totalPrice}</p>
                    </div>
                    ${booking.addons && booking.addons.length > 0 ? `<p><strong>Extras:</strong> ${booking.addons.join(', ')}</p>` : ''}
                    <p>We look forward to welcoming you.</p>
                </div>
            `,
        });
        console.log("Confirmation email sent: %s", info.messageId);
        // If using Ethereal, log the preview URL
        if (info.messageId && info.messageId.includes('@ethereal.email') || (!process.env.EMAIL_USER)) {
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }
    } catch (error) {
        console.error("Error sending confirmation email:", error);
    }
};

const sendNewBookingAlertToAdmin = async (booking, user, room) => {
    try {
        const transporter = await createTransporter();
        const info = await transporter.sendMail({
            from: '"Aethelgard System" <system@aethelgard.com>',
            to: process.env.ADMIN_EMAIL || 'admin@aethelgard.com',
            subject: `New Booking - ${room.name}`,
            html: `
                <div style="font-family: Arial, sans-serif;">
                    <h2>New Booking Received</h2>
                    <p><strong>Guest:</strong> ${user.name} (${user.email})</p>
                    <p><strong>Room:</strong> ${room.name}</p>
                    <p><strong>Dates:</strong> ${new Date(booking.checkIn).toLocaleDateString()} to ${new Date(booking.checkOut).toLocaleDateString()}</p>
                    <p><strong>Total:</strong> $${booking.totalPrice}</p>
                     ${booking.addons && booking.addons.length > 0 ? `<p><strong>Extras:</strong> ${booking.addons.join(', ')}</p>` : ''}
                     ${booking.specialRequests ? `<p><strong>Special Requests:</strong> ${booking.specialRequests}</p>` : ''}
                </div>
            `,
        });
        console.log("Admin alert email sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending admin alert email:", error);
    }
};

module.exports = {
    sendBookingConfirmation,
    sendNewBookingAlertToAdmin
};
