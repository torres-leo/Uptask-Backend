import nodemailer from 'nodemailer';

const createEmailTransport = () => {
	const transport = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASSWORD,
		},
	});

	return transport;
};

export const AuthAccount = async (data) => {
	const { email, token, name } = data;
	const transport = createEmailTransport();

	const info = await transport.sendMail({
		from: '"Uptask - Admin" <accounts@uptask.com>',
		to: email,
		subject: 'UpTask - Confirm your account',
		html: `
      <h1>Confirm your account</h1>
      <p>Hello ${name}.</p>
      <p>Please click on the following link to confirm your account</p>
      <a href="${process.env.FRONTEND_URL}/authenticate/${token}">Confirm account</a>
    `,
	});
};

export const emailResetPassword = async (data) => {
	const { email, token, name } = data;
	const transport = createEmailTransport();

	const info = await transport.sendMail({
		from: '"Uptask - Admin" <accounts@uptask.com>',
		to: email,
		subject: 'UpTask - Reset your password',
		html: `
      <h1>Reset your password.</h1>
      <p>Hello ${name}.</p>
      <p>Please click on the following link to reset your password.</p>
      <a href="${process.env.FRONTEND_URL}/reset-password/${token}">Go to.</a>

			<p>If you did not request a password reset, please ignore this email.</p>
    `,
	});
};
