import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function Mail(to: string, subject: string, html: string) {
    const {data, error} = await resend.emails.send({
        from: "onboarding@resend.dev",
        to,
        subject,
        html,
    });

    console.log("DATA: ", data);
    console.log("ERROR: ", error);
}