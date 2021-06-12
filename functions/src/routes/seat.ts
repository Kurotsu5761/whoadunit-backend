import { Router } from 'express';
import { SeatController } from '../controllers';

// eslint-disable-next-line new-cap
const router = Router();

router.get('/', SeatController.listSeats);

router.post(
    '/',
    SeatController.validate('createSeat'),
    SeatController.createSeat,
);

router.get('/:id', SeatController.getSeat);

router.post(
    '/:id/assign',
    SeatController.validate('assignSeat'),
    SeatController.assignSeat,
);

router.delete('/:id', SeatController.removeSeat);

router.post('/:id/remove', SeatController.removeSeatPerson);

export default router;
