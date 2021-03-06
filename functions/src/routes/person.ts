import { Router } from 'express';
import { PersonController } from '../controllers';

// eslint-disable-next-line new-cap
const router = Router();

router.get('/', PersonController.listPersons);
router.post(
    '/',
    PersonController.validate('createPerson'),
    PersonController.createPerson,
);

router.get('/:id', PersonController.getPerson);
router.put('/:id', PersonController.updatePerson);
router.delete('/:id', PersonController.removePerson);

router.get('/:id/seats', PersonController.getSeats);

router.patch(
    '/:id/add-contact',
    PersonController.validate('addContact'),
    PersonController.addContact,
);
router.patch('/:id/remove-contact', PersonController.removeContact);

export default router;
