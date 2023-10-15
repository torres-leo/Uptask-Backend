import jwt from 'jsonwebtoken';
import User from '../models/User';

const checkAuth = async (req, res, next) => {
	let token;
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		try {
			token = req.headers.authorization.split(' ')[1];
			const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
			// req.user = await User.findById(decoded.uid).select('-password -isActivated -token -createdAt -updatedAt');
			req.user = await User.findById(decoded.uid).select('name email id');
			console.log(req.user);
		} catch (error) {
			console.log(error);
			return res.status(401).json({ msg: 'Invalid token' });
		}
	}

	if (!token) {
		return res.status(401).json({ msg: 'No valid token, authorization denied', error: error.message });
	}

	next();
};

export default checkAuth;
