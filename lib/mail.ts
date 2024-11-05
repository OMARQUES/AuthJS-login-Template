import {Resend} from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (
    email: string, 
    token: string
) => {
    const confirmLink = `http://localhost:3000/auth/new-verificarion?token=${token}`;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Email de verificação",
        html: `<p>Clique <a href="@{confirmLink}">Aqui</a> para confirmar seu email.</p>`
    })
}