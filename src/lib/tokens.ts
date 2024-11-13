import {v4 as uuidv4} from 'uuid';
import { createVerificationToken, deleteVerificationTokenByTokenID, getVerificationTokenByEmail } from '../data/verificationToken';

export const generateVerificationToken = async (
    email: string
) => {
    const token = uuidv4();

    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getVerificationTokenByEmail(email);

    if(existingToken) await deleteVerificationTokenByTokenID(existingToken);
    
    const verificationToken = await createVerificationToken(email, token, expires);

    return verificationToken;
}