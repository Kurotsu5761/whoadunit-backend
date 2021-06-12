import { Router } from 'express';
import { ElectionController } from '../controllers';

// eslint-disable-next-line new-cap
const router = Router();

router.get('/', ElectionController.listElections);

router.post(
    '/',
    ElectionController.validate('createElection'),
    ElectionController.createElection,
);

router.get('/:id', ElectionController.getElection);

export default router;
