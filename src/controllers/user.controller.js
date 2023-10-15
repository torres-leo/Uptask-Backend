import User from '../models/User';
import { generateToken } from '../helpers/generateToken';
import { generateJWT } from '../helpers/generateJWT';
import { AuthAccount, emailResetPassword } from '../helpers/emails';

export const authenticate = async (req, res) => {
	// Checks if the user exists
	const { email, password } = req.body;
	const user = await User.findOne({ email });

	if (!user) {
		return res.status(404).json({ msg: 'User does not exist' });
	}

	// Checks if the user is activated
	if (!user.isActivated) {
		const error = new Error('Your account is not activated yet');
		return res.status(401).json({ msg: error.message });
	}

	if (await user.comparePassword(password)) {
		const { id, name, email, token } = user;

		return res.status(200).json({ msg: 'User authenticated', user: { name, email, token: generateJWT(id) } });
	} else {
		const error = new Error('Incorrect password');
		return res.status(401).json({ msg: error.message });
	}
};

export const confirmAccount = async (req, res) => {
	const { token } = req.params;

	const userToConfirm = await User.findOne({ token });

	if (!userToConfirm) {
		const error = new Error('Invalid token');
		return res.status(403).json({ msg: error.message });
	}

	try {
		userToConfirm.isActivated = true;
		userToConfirm.token = '';
		console.log(userToConfirm);
		await userToConfirm.save();
		res.status(200).json({ msg: 'User Authenticated.' });
	} catch (error) {
		console.log(error);
		res.status(403).json({ msg: 'Error to confirm user', error: error.message });
	}
};

export const resetPassword = async (req, res) => {
	const { email } = req.body;

	const user = await User.findOne({ email });

	if (!user) {
		return res.status(404).json({ msg: 'User does not exist' });
	}

	try {
		user.token = generateToken();
		await user.save();

		emailResetPassword({ email, token: user.token, name: user.name });

		res.status(200).json({ msg: 'An email was sent you with the instructions. ' });
	} catch (error) {
		console.log(error);
		res.status(400).json({ msg: 'Error resetting password', error: error.message });
	}
};

export const checkToken = async (req, res) => {
	const { token } = req.params;

	const validToken = await User.findOne({ token });

	if (!validToken) {
		return res.status(401).json({ msg: 'Invalid token. Please, send your email again to reset your password.' });
	}

	res.status(200).json({ msg: 'Token is valid' });
};

export const changePassword = async (req, res) => {
	const { token } = req.params;
	const { password } = req.body;

	const user = await User.findOne({ token });
	if (!user) {
		return res.status(404).json({ msg: 'Invalid token' });
	}
	try {
		user.password = password;
		user.token = '';
		await user.save();
		res.status(200).json({ msg: 'Password changed successfully' });
	} catch (error) {
		console.log(error);
		res.status(400).json({ msg: 'Error changing password', error: error.message });
	}
};

export const getProfile = async (req, res) => {
	const { user } = req;

	res.json({ user });
};

export const getUsers = async (req, res) => {};

export const getUserById = async (req, res) => {
	res.send('User by id');
};

export const createUser = async (req, res) => {
	try {
		const { name, password, email } = req.body;

		const userExist = await User.findOne({ email });

		if (userExist) {
			return res.status(409).json({ msg: 'User already exist' });
		}

		const newUser = new User({
			name,
			password,
			email,
		});

		newUser.token = generateToken();
		const userSaved = await newUser.save();

		const { name: n, email: e, token } = userSaved;

		AuthAccount({ name, email, token });
		res.status(201).json({ msg: 'User created', user: { name: n, email: e, token } });
	} catch (error) {
		console.log(error);
		res.status(400).json({ msg: 'Error creating user', error: error.message });
	}
};

export const updateUser = async (req, res) => {
	res.send('Update user');
};

export const deleteUser = async (req, res) => {
	res.send('Delete user');
};
