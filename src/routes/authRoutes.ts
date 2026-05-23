import { Router } from 'express';
import { signup, login } from '../controllers/authController';
import { validate } from '../middleware/validation';

const router = Router();

const signupValidation = validate([
  { field: 'name', required: true },
  { field: 'email', required: true, email: true },
  { field: 'password', required: true, minLength: 6 },
  { field: 'role', enum: ['contributor', 'maintainer'] }
]);

const loginValidation = validate([
  { field: 'email', required: true, email: true },
  { field: 'password', required: true }
]);

router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);

export default router;
