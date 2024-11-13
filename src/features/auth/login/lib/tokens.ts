import crypto from 'crypto';
import { createTwoFactorToken, deleteTwoFactorTokenByTokenId, getTwoFactorTokenByEmail } from '@/src/data/twoFactorToken';

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
