import { ContactDetailType } from './../models/person';
import { Request, Response, NextFunction } from 'express';
import { PersonModel } from '../models';
import { body, validationResult } from 'express-validator';
import { PersonStatus } from '../models/person';

export const validate = (method: string) => {
    switch (method) {
        case 'createPerson': {
            return [
                body('name').exists().isString(),
                body('status')
                    .exists()
                    .isString()
                    .isIn(Object.values(PersonStatus)),
                body('address').optional().isString(),
                body('profilePictures').optional().isArray(),
                body('profilePictures.*').isString(),
                body('contactDetails').optional().isArray(),
                body('contactDetails.type')
                    .optional()
                    .isString()
                    .isIn(Object.values(ContactDetailType)),
                body('contactDetails.value').optional().isString(),
            ];
        }
        default:
            return [];
    }
};

export const createPerson = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errorrs: errors.array() });
        }
        const { body } = req;

        if (!body.contactDetails) {
            body.contactDetails = [];
        }
        if (!body.profilePictures) {
            body.profilePictures = [];
        }

        const personId = await PersonModel.create(body);

        res.json({
            id: personId,
        })
            .status(201)
            .end();
    } catch (err) {
        return next(err);
    }
};

export const listPersons = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const list = await PersonModel.list();

        res.json({
            data: list,
        })
            .status(200)
            .end();
    } catch (err) {
        return next(err);
    }
};

export const getPerson = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const person = await PersonModel.get(req.params.id);

        if (!person) {
            return res.sendStatus(404);
        }
        res.json({
            data: person,
        })
            .status(200)
            .end();
    } catch (err) {
        return next(err);
    }
};

export const removePerson = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        await PersonModel.remove(req.params.id);
        res.end();
    } catch (err) {
        return next(err);
    }
};

export const addContact = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const success = await PersonModel.addContact(req.params.id, req.body);
        if (!success) {
            res.sendStatus(400).end();
        } else {
            res.sendStatus(204).end();
        }
    } catch (err) {
        return next(err);
    }
};

export const removeContact = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const success = await PersonModel.removeContact(
            req.params.id,
            req.body,
        );
        if (!success) {
            res.sendStatus(400).end();
        } else {
            res.sendStatus(204).end();
        }
    } catch (err) {
        return next(err);
    }
};
