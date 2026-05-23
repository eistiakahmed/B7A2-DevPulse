import { Router } from 'express';
import {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssue,
  deleteIssue
} from '../controllers/issuesController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

const createIssueValidation = validate([
  { field: 'title', required: true, maxLength: 150 },
  { field: 'description', required: true, minLength: 20 },
  { field: 'type', required: true, enum: ['bug', 'feature_request'] }
]);

const updateIssueValidation = validate([
  { field: 'title', maxLength: 150 },
  { field: 'description', minLength: 20 },
  { field: 'type', enum: ['bug', 'feature_request'] },
  { field: 'status', enum: ['open', 'in_progress', 'resolved'] }
]);

router.post('/', authenticate, createIssueValidation, createIssue);
router.get('/', getAllIssues);
router.get('/:id', getIssueById);
router.patch('/:id', authenticate, updateIssueValidation, updateIssue);
router.delete('/:id', authenticate, authorize('maintainer'), deleteIssue);

export default router;
