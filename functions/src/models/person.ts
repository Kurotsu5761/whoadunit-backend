import { Seat } from './seat';
import app from '../firebase';
import { SeatModel } from '.';
export const db = app.firestore().collection('persons');

export enum ContactDetailType {
    Email = 'email',
    PhoneNumber = 'phoneNumber',
    Facebook = 'facebook',
    Twitter = 'twitter',
}

export enum PersonStatus {
    Incumbent = 'incumbent',
    Inactive = 'inactive',
}

export type ContactDetail = {
    type: ContactDetailType;
    value: string;
};

export type Person = {
    id: string | null;
    name: string;
    status: PersonStatus;
    profilePictures: string[];
    address: string;
    contactDetails: ContactDetail[];
    seats: Seat[];
};

export const create = async (person: Person) => {
    const createdData = await db.add(person);
    return createdData.id;
};

export const list = async (): Promise<Person[]> => {
    const querySnapshot = await db.get();
    const documents: Person[] = [];

    await Promise.all(
        querySnapshot.docs.map(async (document) => {
            const seats = await SeatModel.db
                .where('personId', '==', document.id)
                .get();
            const seatArray: Seat[] = [];

            seats.forEach((document) => {
                seatArray.push({
                    id: document.id,
                    ...document.data(),
                } as Seat);
            });

            documents.push({
                id: document.id,
                ...document.data(),
                seats: seatArray,
            } as Person);
        }),
    );
    return documents;
};

export const get = async (id: string): Promise<Person | null> => {
    const document = await db.doc(id).get();

    if (!document.exists) {
        return null;
    } else {
        const seats = await SeatModel.db
            .where('personId', '==', document.id)
            .get();
        const seatArray: Seat[] = [];

        seats.forEach((document) => {
            seatArray.push({
                id: document.id,
                ...document.data(),
            } as Seat);
        });
        return {
            id: document.id,
            ...document.data(),
            seats: seatArray,
        } as Person;
    }
};

export const update = async (id: string, person: Person) => {
    const document = await db.doc(id).get();
    if (!document.exists) {
        return false;
    }
    try {
        await document.ref.update(person);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const addContact = async (id: string, contactDetail: ContactDetail) => {
    const document = await db.doc(id).get();

    if (!document.exists) {
        return false;
    }
    try {
        const contactDetails = (document.data() as unknown as Person)
            .contactDetails;

        contactDetails.push(contactDetail);
        await document.ref.update({
            contactDetails,
        });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const removeContact = async (
    id: string,
    contactDetail: ContactDetail,
) => {
    const document = await db.doc(id).get();

    if (!document.exists) {
        return false;
    }
    try {
        const contactDetails = (
            document.data() as unknown as Person
        ).contactDetails.filter((contact) => {
            contact !== contactDetail;
        });

        await document.ref.update({
            contactDetails,
        });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const remove = async (id: string) => {
    const deleteRes = await db.doc(id).delete();

    // Remove person Id on seats too
    console.log(deleteRes);
};
