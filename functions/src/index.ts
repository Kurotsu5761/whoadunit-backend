import { UserType } from './models/auth';
require('./firebase');
import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';
import * as jwtUtil from './util/jwt';
import { election, person, seat, auth } from './routes';

// Firebase Initialization

/**
 * Express Application Setup Starts
 */
const app = express();

// Allow Cross Origin Access
app.use(cors({ origin: true }));

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use Middlewares
app.use(
    // Authentication Middleware
    (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) => {
        if (req.method !== 'GET' && !req.path.startsWith('/auth')) {
            console.log(req.path);
            const bearer = req.headers['authorization'];
            if (!bearer || bearer.split(' ').length !== 2) {
                return res.sendStatus(401).end();
            }
            try {
                const token = bearer.split(' ')[1];
                const user = jwtUtil.verify(token);
                if (user.type !== UserType.ADMIN) {
                    return res.sendStatus(401).end();
                }
            } catch {
                return res.sendStatus(401).end();
            }
        }
        next();
    },
);

// Routes
app.use('/elections', election);
app.use('/seats', seat);
app.use('/persons', person);
app.use('/auth', auth);

/**
 * Express Application Setup Ends
 */

exports.api = functions.region('asia-southeast2').https.onRequest(app);
