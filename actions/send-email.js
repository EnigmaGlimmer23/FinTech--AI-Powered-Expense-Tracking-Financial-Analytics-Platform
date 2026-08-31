"use server";

import { Resend } from "resend";


const EMAIL_FROM = process.env.EMAIL_FROM || "FinTech App <onboarding@resend.dev>";

let resendClient = null;
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey.trim().length < 10) {
    // Fail loudly and specifically instead of letting the SDK throw a
    // generic auth error deep inside a cron job where nobody is watching.
    throw new Error(
      "RESEND_API_KEY is missing or invalid. Set a valid Resend API key in your environment before sending email."
    );
  }

  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

export async function sendEmail({ to, subject, react }) {
  if (!to || !subject || !react) {
    const error = new Error(
      "sendEmail requires 'to', 'subject', and 'react' to be provided."
    );
    console.error("Failed to send email:", error.message);
    return { success: false, error: error.message };
  }

  try {
    const resend = getResendClient();

    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject,
      react,
    });

    if (error) {
      // The Resend SDK returns provider-side errors in the `error` field
      // rather than throwing, so this must be checked explicitly.
      console.error(`Failed to send email to ${to}:`, error);
      return { success: false, error: error.message || String(error) };
    }

    return { success: true, data };
  } catch (error) {
    // Configuration/network errors land here.
    console.error(`Failed to send email to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
}