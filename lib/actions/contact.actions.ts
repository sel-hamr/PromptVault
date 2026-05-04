"use server";

import { actionClient } from "@/lib/safe-action";
import { contactFormSchema } from "@/lib/validators";
import { resend } from "@/lib/mail";

export const sendContactEmailAction = actionClient
  .schema(contactFormSchema)
  .action(async ({ parsedInput }) => {
    const { name, email, subject, message } = parsedInput;

    const { error } = await resend.emails.send({
      from: "PromptVault <onboarding@resend.dev>",
      to: "selhamr9@gmail.com",
      subject: `[PromptVault Contact] ${subject}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="margin-bottom:4px">New contact message</h2>
          <p style="color:#6b7280;margin-top:0">Received via PromptVault contact form</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0" />
          <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space:pre-wrap;background:#f9fafb;padding:12px 16px;border-radius:6px;border:1px solid #e5e7eb">${message}</p>
        </div>
      `,
    });

    if (error) return { error: "Failed to send message. Please try again." };

    return { success: true };
  });
