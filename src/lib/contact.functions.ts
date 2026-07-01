import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const contactBriefSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  company: z.string().trim().min(1).max(150),
  budget: z.string().trim().min(1).max(100),
  deadline: z.string().trim().min(1).max(50),
  preferred_time: z.string().trim().min(1).max(150),
  timezone: z.string().trim().min(1).max(100),
  project_details: z.string().trim().min(1).max(500),
  message: z.string().trim().min(10).max(2000),
});

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
const TO_EMAIL = "editic.studio.info@gmail.com";
const FROM_EMAIL = "noreply@jepystudio.com";

const esc = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export type ContactBriefInput = z.infer<typeof contactBriefSchema>;

export const sendContactBrief = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => contactBriefSchema.parse(input))
  .handler(async ({ data }) => {
    const lovableApiKey = process.env.LOVABLE_API_KEY;
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!lovableApiKey || !resendApiKey) {
      console.error("Contact email not configured", {
        hasLovableApiKey: Boolean(lovableApiKey),
        hasResendApiKey: Boolean(resendApiKey),
      });
      throw new Error("Email is not configured");
    }

    const rows: [string, string][] = [
      ["Name", data.name],
      ["Email", data.email],
      ["Company", data.company],
      ["Budget", data.budget],
      ["Deadline", data.deadline],
      ["Preferred meeting time", data.preferred_time],
      ["Timezone", data.timezone],
      ["Project details", data.project_details],
      ["Message", data.message],
    ];

    const html = `
      <div style="font-family:Inter,Arial,sans-serif;background:#050505;color:#f3f4f6;padding:32px">
        <h2 style="color:#53FF2F;margin:0 0 16px">New Send Brief Submission</h2>
        <p style="margin:0 0 24px;color:#9ca3af">From ${esc(data.name)} &lt;${esc(data.email)}&gt;</p>
        <table style="width:100%;border-collapse:collapse;background:#0f0f0f;border:1px solid #222;border-radius:8px;overflow:hidden">
          ${rows
            .map(
              ([label, value]) => `
            <tr>
              <td style="padding:12px 16px;border-bottom:1px solid #1a1a1a;color:#9ca3af;width:220px;vertical-align:top">${esc(label)}</td>
              <td style="padding:12px 16px;border-bottom:1px solid #1a1a1a;color:#f3f4f6;white-space:pre-wrap">${esc(value)}</td>
            </tr>`,
            )
            .join("")}
        </table>
      </div>`;

    const text = [
      "New Send Brief Submission",
      "",
      ...rows.map(([label, value]) => `${label}: ${value}`),
    ].join("\n");

    const response = await fetch(`${GATEWAY_URL}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableApiKey}`,
        "X-Connection-Api-Key": resendApiKey,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: data.email,
        subject: `New Brief from ${data.name}`,
        html,
        text,
      }),
    });

    const body = await response.text();
    if (!response.ok) {
      console.error("Resend connector send failed", response.status, body.slice(0, 1000));
      throw new Error("Email send failed");
    }

    let id: string | undefined;
    try {
      const json = JSON.parse(body) as { id?: string };
      id = json.id;
    } catch {
      id = undefined;
    }

    return { ok: true, id };
  });