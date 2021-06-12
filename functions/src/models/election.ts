import app from '../firebase';
const db = app.firestore().collection('elections');

export type Election = {
    id: string | null;
    year: number;
};

export const create = async (election: Election) => {
    const createdData = await db.add(election);
    return createdData.id;
};

export const list = async (): Promise<Election[]> => {
    const querySnapshot = await db.get();
    const documents: Election[] = [];
    querySnapshot.forEach((document) => {
        documents.push({
            id: document.id,
            ...document.data(),
        } as Election);
    });
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
