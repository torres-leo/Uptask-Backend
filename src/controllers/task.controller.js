import Task from '../models/Task';
import Project from '../models/Projects';

export const addNewTask = async (req, res) => {
	const { project } = req.body;

	const projectExist = await Project.findById(project);
	if (!projectExist) {
		const error = new Error('Project not Found');
		return res.status(404).json({ msg: error.message });
	}

	// Only the project author can add tasks
	if (projectExist.createdBy.toString() !== req.user._id.toString()) {
		const error = new Error("You don't have permissions to add new task in this project.");
		return res.status(401).json({ msg: error.message });
	}

	try {
		const task = await Task.create(req.body);
		res.json(task);
	} catch (error) {
		console.log(error);
		res.status(500).json({ msg: error.message });
	}
};

export const getTask = async (req, res) => {
	const { id } = req.params;

	const task = await Task.findById(id).populate('project');

	if (!task) {
		const error = new Error('Task Not Found.');
		return res.status(404).json({ msg: error.message });
	}

	if (task.project.createdBy.toString() !== req.user._id.toString()) {
		const error = new Error('Invalid action');
		return res.status(403).json({ msg: error.message });
	}

	res.json(task);
};

export const updateTask = async (req, res) => {
	const { id } = req.params;

	const task = await Task.findById(id).populate('project');

	if (!task) {
		const error = new Error('Task Not Found.');
		return res.status(404).json({ msg: error.message });
	}

	if (task.project.createdBy.toString() !== req.user._id.toString()) {
		const error = new Error('Invalid action');
		return res.status(403).json({ msg: error.message });
	}

	task.title = req.body.title ?? task.title;
	task.description = req.body.description ?? task.description;
	task.priority = req.body.priority ?? task.priority;
	task.deadline = req.body.deadline ?? task.deadline;

	try {
		const modifiedTask = await task.save();
		res.json(modifiedTask);
	} catch (error) {
		console.log(error);
	}
};

export const deleteTask = async (req, res) => {
	const { id } = req.params;
	try {
		const task = await Task.findById(id).populate('project');
		if (!task) {
			const error = new Error('Task Not Found.');
			return res.status(404).json({ msg: error.message });
		}
		if (task.project.createdBy.toString() !== req.user._id.toString()) {
			const error = new Error('Invalid action');
			return res.status(403).json({ msg: error.message });
		}
		await task.deleteOne();
		res.status(200).json({ msg: `Task "${task.title}" deleted.` });
	} catch (error) {
		console.log(error);
		res.status(500).json({ msg: 'Error deleting project', error: error.message });
	}
};

export const changeStateTask = async (req, res) => {};
