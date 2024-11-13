import {v4 as uuidv4} from 'uuid';
import { getPasswordResetTokenByEmail } from '@/src/data/passwordVerificationToken';
import { createPasswordResetToken, deletePasswordResetTokenWithUserId } from '@/src/data/twoFactorToken';

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
