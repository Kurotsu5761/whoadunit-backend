import { SeatModel } from '.';
import app from '../firebase';
import { Seat } from './seat';
const db = app.firestore().collection('elections');

export type Election = {
    id: string | null;
    year: number;
    seats: Seat[];
};

export const create = async (election: Election) => {
    const createdData = await db.add(election);
    return createdData.id;
};

export const list = async (): Promise<Election[]> => {
    const querySnapshot = await db.get();
    const documents: Election[] = [];
    await Promise.all(
        querySnapshot.docs.map(async (document) => {
            const seats = (await SeatModel.list(document.id)) ?? [];

            documents.push({
                id: document.id,
                ...document.data(),
                seats,
            } as Election);
        }),
    );
    return documents;
};

export const get = async (id: string): Promise<Election | null> => {
    const document = await db.doc(id).get();

    if (!document.exists) {
        return null;
    } else {
        return {
            id: document.id,
            ...document.data(),
        } as Election;
    }
};
