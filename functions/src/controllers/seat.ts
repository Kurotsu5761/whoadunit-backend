import { Request, Response, NextFunction } from 'express';
import { SeatModel } from '../models';
import { body, validationResult } from 'express-validator';
import { SeatType } from '../models/seat';

export const validate = (method: string) => {
    switch (method) {
        case 'createSeat': {
            return [
                body('type')
                    .exists()
                    .isString()
                    .isIn([...Object.values(SeatType)]),
                body('year').exists().isInt(),
                body('code').exists().isString(),
                body('state').exists().isString(),
                body('name').exists().isString(),
                body('personId').optional().isString(),
            ];
        }
        case 'assignSeat': {
            return [body('personId').exists().isString()];
        }
        default:
            return [];
    }
};

export const createSeat = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errorrs: errors.array() });
        }

        const seatId = await SeatModel.create(req.body);

        res.json({
            id: seatId,
        })
            .status(201)
            .end();
    } catch (err) {
        return next(err);
    }
};

export const listSeats = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const list = await SeatModel.list(
            req.query['year'] as unknown as number,
        );

        res.json({
            data: list,
        })
            .status(200)
            .end();
    } catch (err) {
        return next(err);
    }
};

export const getSeat = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const seat = await SeatModel.get(req.params.id);

        if (!seat) {
            return res.sendStatus(404);
        }
        res.json({
            data: seat,
        })
            .status(200)
            .end();
    } catch (err) {
        return next(err);
    }
};

export const removeSeat = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        await SeatModel.remove(req.params.id);
        res.end();
    } catch (err) {
        return next(err);
    }
};

export const assignSeat = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const success = await SeatModel.assignSeat(
            req.params.id,
            req.body.personId,
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

export const removeSeatPerson = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const success = await SeatModel.removeSeatPerson(req.params.id);

        if (!success) {
            res.sendStatus(400).end();
        } else {
            res.sendStatus(204).end();
        }
    } catch (err) {
        return next(err);
    }
};
