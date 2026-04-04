import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function Mail(to: string, subject: string, html: string) {
    await resend.emails.send({
        from: "Mundra Website <onboarding@resend.dev>",
        to: "fcdbbrainy@gmail.com",
        subject,
        html,
    });
}