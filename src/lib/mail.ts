import { PATH } from "@/src/utils/constants";
import {Resend} from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendVerificationEmail = async (
    email: string, 
    token: string
) => {
    const confirmLink = `${domain}${PATH.NEW_VERIFICATION_PATH}?token=${token}`;

    return await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Email de verificação",
        html: `<p>Clique <a href="${confirmLink}">Aqui</a> para confirmar seu email.</p>`
    })
}