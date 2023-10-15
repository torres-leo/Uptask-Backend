import express from 'express';

import checkAuth from '../middleware/checkAuth';
import { addNewTask, changeStateTask, deleteTask, getTask, updateTask } from '../controllers/task.controller';
import { taskSchema, updateTaskSchema, validateSchema } from '../validations';

const router = express.Router();

router.post('/', [checkAuth, validateSchema(taskSchema)], addNewTask);

router
	.route('/:id')
	.get(checkAuth, getTask)
	.put([checkAuth, validateSchema(updateTaskSchema)], updateTask)
	.delete(checkAuth, deleteTask);

router.post('/change-state/:id', checkAuth, changeStateTask);

export default router;
