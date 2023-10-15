import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			length: 50,
		},
		email: {
			type: String,
			unique: true,
			required: true,
			trim: true,
			length: 50,
		},
		password: {
			type: String,
			trim: true,
			required: true,
		},
		token: {
			type: String,
		},
		isActivated: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

UserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);

	next();
});

UserSchema.methods.comparePassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', UserSchema);

export default User;
