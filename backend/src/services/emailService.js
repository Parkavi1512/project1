const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async sendWelcomeEmail(email, name, role) {
        const subject = `Welcome to Smart Internship Matcher!`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #4F46E5;">Welcome to Smart Internship Matcher!</h2>
                <p>Hello ${name},</p>
                <p>Welcome to our platform! Your ${role} account has been successfully created.</p>
                <p>Get started by completing your profile to get personalized internship recommendations.</p>
                <a href="${process.env.FRONTEND_URL}/dashboard" 
                   style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; 
                          color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">
                    Go to Dashboard
                </a>
                <p style="margin-top: 30px;">Best regards,<br>The Smart Internship Matcher Team</p>
            </div>
        `;

        await this.sendEmail(email, subject, html);
    }

    async sendInternshipMatchNotification(studentEmail, studentName, internships) {
        const subject = `New Internship Matches for You!`;
        
        let internshipsHTML = '';
        internships.slice(0, 5).forEach(internship => {
            internshipsHTML += `
                <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px;">
                    <h3 style="margin: 0; color: #4F46E5;">${internship.title}</h3>
                    <p style="margin: 5px 0;"><strong>Company:</strong> ${internship.companyName}</p>
                    <p style="margin: 5px 0;"><strong>Location:</strong> ${internship.location}</p>
                    <p style="margin: 5px 0;"><strong>Match Score:</strong> ${internship.score}%</p>
                </div>
            `;
        });

        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #4F46E5;">New Internship Opportunities Matched for You!</h2>
                <p>Hello ${studentName},</p>
                <p>We found ${internships.length} new internships that match your profile:</p>
                ${internshipsHTML}
                <a href="${process.env.FRONTEND_URL}/student/recommendations" 
                   style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; 
                          color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">
                    View All Recommendations
                </a>
                <p style="margin-top: 30px;">Best regards,<br>The Smart Internship Matcher Team</p>
            </div>
        `;

        await this.sendEmail(studentEmail, subject, html);
    }

    async sendApplicationConfirmation(studentEmail, studentName, internshipTitle, companyName) {
        const subject = `Application Submitted Successfully`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #4F46E5;">Application Submitted!</h2>
                <p>Hello ${studentName},</p>
                <p>Your application for <strong>${internshipTitle}</strong> at <strong>${companyName}</strong> has been submitted successfully.</p>
                <p>The recruiter will review your application and contact you if you're shortlisted.</p>
                <a href="${process.env.FRONTEND_URL}/student/applications" 
                   style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; 
                          color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">
                    Track Your Applications
                </a>
                <p style="margin-top: 30px;">Best regards,<br>The Smart Internship Matcher Team</p>
            </div>
        `;

        await this.sendEmail(studentEmail, subject, html);
    }

    async sendNewApplicationNotification(recruiterEmail, recruiterName, studentName, internshipTitle) {
        const subject = `New Application Received`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #4F46E5;">New Application Received</h2>
                <p>Hello ${recruiterName},</p>
                <p><strong>${studentName}</strong> has applied for your internship: <strong>${internshipTitle}</strong></p>
                <a href="${process.env.FRONTEND_URL}/recruiter/applications" 
                   style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; 
                          color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">
                    Review Applications
                </a>
                <p style="margin-top: 30px;">Best regards,<br>The Smart Internship Matcher Team</p>
            </div>
        `;

        await this.sendEmail(recruiterEmail, subject, html);
    }

    async sendEmail(to, subject, html) {
        try {
            const mailOptions = {
                from: `"Smart Internship Matcher" <${process.env.EMAIL_USER}>`,
                to,
                subject,
                html
            };

            await this.transporter.sendMail(mailOptions);
            console.log(`Email sent to ${to}`);
        } catch (error) {
            console.error('Error sending email:', error);
            // Don't throw error to avoid breaking the main flow
        }
    }
}

module.exports = new EmailService();