import * as jwtUtil from '../util/jwt';
import * as pwdUtil from '../util/password';
import app from '../firebase';
export const db = app.firestore().collection('auth');

export enum UserType {
    USER = 'user',
    ADMIN = 'admin',
}

export type User = {
    id: string | null;
    username: string;
    password: string;
    type: UserType | null;
};

export const register = async (user: User): Promise<string> => {
    const querySnapshot = await db.where('username', '==', user.username).get();
    if (querySnapshot.docs.length > 0) {
        throw Error('User existed');
    }

    user = {
        ...user,
        password: pwdUtil.hash(user.password),
    };
    const createdData = await db.add(user);
    return createdData.id;
};

export const login = async (user: User): Promise<string> => {
    const querySnapshot = await db.where('username', '==', user.username).get();

    if (querySnapshot.docs.length <= 0) {
        throw Error('Unauthenticated');
    }

    const dataDocs = querySnapshot.docs[0];
    const data = dataDocs.data();

    if (!pwdUtil.compare(user.password, data.password)) {
        throw Error('Unauthenticated');
    }

    return jwtUtil.sign({ id: dataDocs.id, ...data } as User);
};
