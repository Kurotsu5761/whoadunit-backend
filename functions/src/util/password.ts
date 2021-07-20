import * as bcrypt from 'bcrypt';
const saltRounds = 10;

export const hash = (password: string): string => {
    return bcrypt.hashSync(password, saltRounds);
};

export const compare = (password: string, hashed: string): boolean => {
    return bcrypt.compareSync(password, hashed);
};
