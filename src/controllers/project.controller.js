import Project from '../models/Projects';
import Task from '../models/Task';

export const getProjects = async (req, res) => {
	const projects = await Project.find().where('createdBy').equals(req.user);

	res.json(projects);
};

export const getProject = async (req, res) => {
	const { id } = req.params;

	try {
		const project = await Project.findById(id);

		if (!project) {
			const error = new Error('Project Not Found');
			return res.status(404).json({ msg: error.message });
		}

		if (project.createdBy.toString() !== req.user._id.toString()) {
			const error = new Error('Invalid Action');
			return res.status(401).json({ msg: error.message });
		}

		const tasks = await Task.find().where('project').equals(project._id);

		res.status(200).json({ project, tasks });
	} catch (error) {
		console.log(error);
		res.status(500).json({ msg: 'Error while retrieve Project', error: error.message });
	}
};

export const newProject = async (req, res) => {
	const project = new Project(req.body);

	project.createdBy = req.user._id;

	try {
		const storeProject = await project.save();
		res.json(storeProject);
	} catch (error) {
		console.log(error);
		res.status(400).json({ msg: 'Error creating project', error: error.message });
	}
};

export const updateProject = async (req, res) => {
	const { id } = req.params;

	try {
		const project = await Project.findById(id);

		if (project.createdBy.toString() !== req.user._id.toString()) {
			const error = new Error('Invalid Action');
			return res.status(401).json({ msg: error.message });
		}

		project.title = req.body.title ?? project.title;
		project.description = req.body.description ?? project.description;
		project.deadline = req.body.deadline ?? project.deadline;
		project.client = req.body.client ?? project.client;

		await project.save();
		res.json(project);
	} catch (error) {
		console.log(error);
		res.status(404).json({ msg: 'Error while retrieve Project', error: error.message });
	}
};

export const deleteProject = async (req, res) => {
	const { id } = req.params;

	try {
		const project = await Project.findById(id);

		if (!project) {
			const error = new Error('Project not Found.');
			return res.status(404).json({ msg: error.message });
		}

		if (project.createdBy.toString() !== req.user._id.toString()) {
			const error = new Error('Invalid Action');
			return res.status(401).json({ msg: error.message });
		}

		await project.deleteOne();

		res.status(200).json({ msg: `Project "${project.name}" deleted.` });
	} catch (error) {
		console.log(error);
		res.status(500).json({ msg: 'Error deleting project', error: error.message });
	}
};

export const addContributorToProject = async (req, res) => {};

export const removeContributorFromProject = async (req, res) => {};
