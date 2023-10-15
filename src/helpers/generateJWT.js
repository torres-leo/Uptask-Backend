import jwt from 'jsonwebtoken';

export const generateJWT = (uid) => {
	return jwt.sign({ uid }, process.env.SECRET_KEY_JWT, {
		expiresIn: '1d',
	});
};
