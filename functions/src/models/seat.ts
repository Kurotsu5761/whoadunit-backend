import { PersonModel } from '.';
import app from '../firebase';
import { Person } from './person';
export const db = app.firestore().collection('seats');

export enum SeatType {
    MP = 'MP',
    ADUN = 'ADUN',
}

export type Seat = {
    id: string | null;
    electionId: string;
    type: SeatType;
    code: string;
    state: string;
    name: string;
    person: Person;
    personId: string;
};

export const create = async (seat: Seat) => {
    const createdData = await db.add(seat);
    return createdData.id;
};

export const assignSeat = async (seatId: string, personId: string) => {
    const document = await db.doc(seatId).get();

    if (!document.exists) {
        return false;
    }
    try {
        await document.ref.update({
            personId: personId,
        });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const removeSeatPerson = async (id: string) => {
    const document = await db.doc(id).get();

    if (!document.exists) {
        return false;
    }
    try {
        await document.ref.update({
            personId: null,
        });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const list = async (electionId?: string) => {
    let querySnapshot;
    if (typeof electionId !== 'undefined') {
        querySnapshot = await db.where('electionId', '==', electionId).get();
    } else {
        querySnapshot = await db.get();
    }
    const documents: Seat[] = [];

    await Promise.all(
        querySnapshot.docs.map(async (document) => {
            const data = document.data();
            let person;

            if (data?.personId) {
                person = (await PersonModel.db.doc(data.personId).get()).data();
            }
            documents.push({
                id: document.id,
                ...data,
                person,
            } as Seat);
        }),
    );
    return documents;
};

export const get = async (id: string) => {
    const document = await db.doc(id).get();

    if (!document.exists) {
        return null;
    }

    const data = document.data();
    let person;

    if (data?.personId) {
        person = (await PersonModel.db.doc(data.personId).get()).data();
    }

    return {
        id: document.id,
        ...data,
        person,
    } as Seat;
};

export const update = async (id: string, seat: Seat) => {
    const document = await db.doc(id).get();
    if (!document.exists) {
        return false;
    }
    try {
        await document.ref.update(seat);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const remove = async (id: string) => {
    const deleteRes = await db.doc(id).delete();
    console.log(deleteRes);
};
