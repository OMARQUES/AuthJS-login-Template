import crypto from 'crypto';
import {v4 as uuidv4} from 'uuid';
import { createVerificationToken, deleteVerificationTokenByTokenID, getVerificationTokenByEmail } from '../data/verificationToken';
import { getPasswordResetTokenByEmail } from '@/data/passwordVerificationToken';
import { createPasswordResetToken, createTwoFactorToken, deletePasswordResetTokenWithUserId, deleteTwoFactorTokenByTokenId, getTwoFactorTokenByEmail } from '@/data/twoFactorToken';

export const generateTwoFactorToken = async (
    email: string
) => {
    const token = crypto.randomInt(100_000, 1_000_000).toString();
    const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

    const existingToken = await getTwoFactorTokenByEmail(email);

    if(existingToken) await deleteTwoFactorTokenByTokenId(existingToken);
    
    const twoFactorToken = await createTwoFactorToken(email, token, expires);

    return twoFactorToken;
}

export const generatePasswordResetToken = async (
    email: string
) => {
    const token = uuidv4();
    
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getPasswordResetTokenByEmail(email);
    
    if(existingToken) await deletePasswordResetTokenWithUserId(existingToken);

    const passwordResetToken = await createPasswordResetToken(email, token, expires);

    return passwordResetToken;
}

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