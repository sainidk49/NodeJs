const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const busboy = require('busboy');
const xlsx = require('xlsx');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS 
    },
});


app.post('/send-emails', (req, res) => {
    const bb = busboy({ headers: req.headers });
    let pdfBuffer = null;
    const recipients = [];

    bb.on('file', (fieldname, file, filename) => {
        const chunks = [];
        file.on('data', (data) => {
            chunks.push(data);
        });

        file.on('end', () => {
            const buffer = Buffer.concat(chunks);
            if (filename.mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                // Read Excel file for recipients
                const workbook = xlsx.read(buffer, { type: 'buffer' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

                // Assuming emails are in the first column (index 0)
                for (const row of data) {
                    if (row[0]) {
                        recipients.push(row[0].toString().trim());
                    }
                }
            }
            else if (filename.mimeType === 'application/pdf') {
                pdfBuffer = buffer;
            }
            else {
                return res.status(400).send('Unsupported file type. Please upload a PDF and an Excel file.');
            }
        });
    });
    bb.on('finish', async () => {
        if (!pdfBuffer) {
            return res.status(400).send('No PDF file uploaded.');
        }

        if (recipients.length === 0) {
            return res.status(400).send('No recipients found in the Excel file.');
        }

        const validEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const validRecipients = recipients.filter(email => validEmailRegex.test(email));

        if (validRecipients.length === 0) {
            return res.status(400).send('No valid recipients found in the Excel file.');
        }

        const results = [];
        for (const email of validRecipients) {
            const mailOptions = {
                from: "arya94105@gmail.com",
                to: email,
                subject: 'Bulk Email with PDF Attachment',
                text: 'Please find the attached PDF.',
                attachments: [{ filename: 'attachment.pdf', content: pdfBuffer }],
            };

            try {
                const info = await transporter.sendMail(mailOptions);
                console.log(`Email sent to ${email}: ${info.response}`);
                results.push({ email, status: 'sent' });
            } catch (error) {
                console.error(`Error sending email to ${email}:`, error);
                results.push({ email, status: 'failed', error: error.message });
            }
        }

        return res.status(200).json({ message: 'Emails processed.', results });
    });

    req.pipe(bb);
});

// Basic route for testing
app.get('/', (req, res) => {
    return res.status(200).send('Hello, world!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
