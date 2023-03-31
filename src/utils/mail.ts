import sgMail, { type MailDataRequired } from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

async function sendMail(payload: MailDataRequired) {
	try {
		await sgMail.send(payload);
	} catch (error) {
		console.log(error, 'Error sending email.');
	}
}

export default sendMail;
