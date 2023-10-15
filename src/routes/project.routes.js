import express from 'express';
import {
	addContributorToProject,
	deleteProject,
	getProject,
	getProjects,
	newProject,
	removeContributorFromProject,
	updateProject,
} from '../controllers/project.controller';
import checkAuth from '../middleware/checkAuth';
import { projectSchema, updateProjectSchema, validateSchema } from '../validations';

const router = express.Router();

router
	.route('/')
	.get(checkAuth, getProjects)
	.post([checkAuth, validateSchema(projectSchema)], newProject);

router
	.route('/:id')
	.get(checkAuth, getProject)
	.put([checkAuth, validateSchema(updateProjectSchema)], updateProject)
	.delete(checkAuth, deleteProject);

router.post('/add-contributor/:id', checkAuth, addContributorToProject);

router.post('/remove-contributor/:id', checkAuth, removeContributorFromProject);
export default router;
