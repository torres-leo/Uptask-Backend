import { Router } from 'express';
import { userSchema, validateSchema } from '../validations';
import {
	authenticate,
	changePassword,
	checkToken,
	confirmAccount,
	createUser,
	deleteUser,
	getProfile,
	getUserById,
	getUsers,
	resetPassword,
	updateUser,
} from '../controllers/user.controller';
import checkAuth from '../middleware/checkAuth';

const router = Router();

router.post('/login', authenticate);
router.get('/confirm-user/:token', confirmAccount);
router.post('/reset-password', resetPassword);
// router.get('/reset-password/:token', checkToken);
// router.post('/reset-password/:token', changePassword);
router.route('/reset-password/:token').get(checkToken).put(changePassword);
router.get('/profile', checkAuth, getProfile);

router.get('', getUsers);
router.get('/:id', getUserById);
router.post('', validateSchema(userSchema), createUser);
router.put('/:id', validateSchema(userSchema), updateUser);
router.delete('/:id', deleteUser);

export default router;
