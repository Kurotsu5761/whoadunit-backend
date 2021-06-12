require('./firebase');
import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';
import { election, person, seat } from './routes';

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
        next();
    },
);

// Routes
app.use('/elections', election);
app.use('/seats', seat);
app.use('/persons', person);

/**
 * Express Application Setup Ends
 */

exports.api = functions.region('asia-southeast2').https.onRequest(app);
