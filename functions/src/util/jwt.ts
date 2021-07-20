import * as jwt from 'jsonwebtoken';
import * as functions from 'firebase-functions';
import { User } from '../models/auth';

const secret = functions.config().jwt.key;

export const checkSecret = (str: string) => {
    return str === secret;
};

export const sign = (user: User): string => {
    return jwt.sign(
        {
            ...user,
            password: undefined,
        },
        secret,
        {
            expiresIn: '1d',
        },
    );
};

export const verify = (token: string): any | boolean => {
    try {
        return jwt.verify(token, secret);
    } catch {
        return false;
    }
};
