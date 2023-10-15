import mongoose from 'mongoose';

const ProjectSchema = mongoose.Schema(
	{
		// Create a model for a project
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		deadline: {
			type: Date,
			default: Date.now(),
		},
		client: {
			type: String,
			trim: true,
			required: true,
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		Contributors: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
	},
	{ timestamps: true }
);

const Project = mongoose.model('Project', ProjectSchema);

export default Project;
