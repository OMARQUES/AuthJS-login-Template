import { PATH } from "@/src/utils/constants";
import {Resend} from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendPasswordResetEmail = async (
    email: string,
    token: string
) => {
    const resetLink = `${domain}${PATH.NEW_PASSWORD_PATH}?token=${token}`;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Recuperação de senha",
        html: `<p>Clique <a href="${resetLink}">Aqui</a> para alterar sua senha.</p>`
    })
}