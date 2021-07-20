import { UserType } from './../models/auth';
import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import * as jwtUtil from '../util/jwt';
import { AuthModel } from '../models';

export const validate = (method: string) => {
    switch (method) {
        case 'register':
        case 'login': {
            return [
                body('username').exists().isString(),
                body('password').exists().isString(),
            ];
        }
        default:
            return [];
    }
};

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errorrs: errors.array() });
    }

    const secret = req.headers['x-auth-api-key'] as string;
    const { body } = req;
    body.type = UserType.USER;

    if (!!secret && jwtUtil.checkSecret(secret)) {
        body.type = UserType.ADMIN;
    }
    try {
        const userId = await AuthModel.register(body);
        res.json({
            id: userId,
        })
            .status(201)
            .end();
    } catch (err) {
        res.json({ message: err.message }).status(400).end();
    }
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errorrs: errors.array() });
    }

    const { body } = req;
    try {
        const token = await AuthModel.login(body);
        res.json({
            token,
        })
            .status(200)
            .end();
    } catch (err) {
        res.send(err.message).status(401).end();
    }
};
