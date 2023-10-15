export const generateToken = () => {
	const random = Math.random().toString(36).substring(2);
	const date = Date.now().toString(32);

	return random + date;
};
