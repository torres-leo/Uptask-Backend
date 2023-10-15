import Joi from 'joi';

export const userSchema = Joi.object({
	name: Joi.string().required().trim().min(3).max(50),
	email: Joi.string().email().required().trim(),
	password: Joi.string().required().trim().min(6).max(20),
});

export const projectSchema = Joi.object({
	title: Joi.string().required().trim().min(10).max(200),
	description: Joi.string().min(20).max(3000).trim(),
	deadline: Joi.date()
		.required()
		.min(new Date().toISOString().split('T')[0])
		.default(new Date().toISOString().split('T')[0]),
	client: Joi.string().required().trim(),
});

export const updateProjectSchema = Joi.object({
	title: Joi.string().trim().min(10).max(200),
	description: Joi.string().min(20).max(3000).trim(),
	client: Joi.string().trim(),
});

export const taskSchema = Joi.object({
	title: Joi.string().required().trim().min(10).max(200),
	description: Joi.string().min(20).max(3000).trim(),
	priority: Joi.string().required().valid('Low', 'Medium', 'High').trim(),
	project: Joi.string().required().trim(),
});

export const updateTaskSchema = Joi.object({
	title: Joi.string().trim().min(10).max(200),
	description: Joi.string().min(20).max(3000).trim(),
	priority: Joi.string().valid('Low', 'Medium', 'High').trim(),
	project: Joi.string().trim(),
});

export const validateSchema = (schema) => {
	return async (req, res, next) => {
		try {
			await schema.validateAsync(req.body);
			next();
		} catch (error) {
			res.status(400).send({ msg: error.message });
		}
	};
};
