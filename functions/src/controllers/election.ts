import { Request, Response, NextFunction } from 'express';
import { ElectionModel } from '../models';
import { body, validationResult } from 'express-validator';

export const validate = (method: string) => {
    switch (method) {
        case 'createElection': {
            return [body('year').exists().isInt()];
        }
        default:
            return [];
    }
};

export const createElection = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errorrs: errors.array() });
        }

        const electionId = await ElectionModel.create(req.body);

        res.json({
            id: electionId,
        }).status(201);
    } catch (err) {
        return next(err);
    }
};

export const listElections = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const list = await ElectionModel.list();

        res.json({
            data: list,
        }).status(200);
    } catch (err) {
        return next(err);
    }
};

export const getElection = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const election = await ElectionModel.get(req.params.id);

        if (!election) {
            return res.sendStatus(404);
        }
        res.json({
            data: election,
        }).status(200);
    } catch (err) {
        return next(err);
    }
};
