import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const schema = z.object({
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

const TO = "editic.studio.info@gmail.com";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const Route = createFileRoute("/api/public/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }
        const parsed = schema.safeParse(payload);
        if (!parsed.success) {
          return Response.json(
            { error: "Validation failed", issues: parsed.error.issues },
            { status: 400 },
          );
        }
        const d = parsed.data;

        const RESEND_API_KEY =
          (typeof globalThis !== "undefined" && (globalThis as any).__env__?.JEPY_RESEND_API_KEY) ??
          process.env.JEPY_RESEND_API_KEY ??
          process.env.RESEND_API_KEY;
        if (!RESEND_API_KEY) {
          console.error("Email not configured: missing JEPY_RESEND_API_KEY");
          return Response.json({ error: "Email not configured" }, { status: 500 });
        }

        const rows: [string, string][] = [
          ["Name", d.name],
          ["Email", d.email],
          ["Company", d.company],
          ["Budget", d.budget],
          ["Deadline", d.deadline],
          ["Timezone", d.timezone],
          ["Preferred meeting time", d.preferred_time || "—"],
          ["Project details", d.project_details],
        ];

        const html = `
          <div style="font-family:Inter,Arial,sans-serif;background:#050505;color:#f3f4f6;padding:32px">
            <h2 style="color:#53FF2F;margin:0 0 16px">New Contact Form Submission</h2>
            <p style="margin:0 0 24px;color:#9ca3af">From ${esc(d.name)} &lt;${esc(d.email)}&gt;</p>
            <table style="width:100%;border-collapse:collapse;background:#0f0f0f;border:1px solid #222;border-radius:8px;overflow:hidden">
              ${rows
                .map(
                  ([k, v]) => `
                <tr>
                  <td style="padding:12px 16px;border-bottom:1px solid #1a1a1a;color:#9ca3af;width:200px;vertical-align:top">${esc(k)}</td>
                  <td style="padding:12px 16px;border-bottom:1px solid #1a1a1a;color:#f3f4f6">${esc(v)}</td>
                </tr>`,
                )
                .join("")}
            </table>
            <h3 style="color:#53FF2F;margin:24px 0 8px">Message</h3>
            <div style="padding:16px;background:#0f0f0f;border:1px solid #222;border-radius:8px;white-space:pre-wrap">${esc(d.message)}</div>
          </div>`;

        const text = [
          "New Contact Form Submission",
          ...rows.map(([k, v]) => `${k}: ${v}`),
          "",
          "Message:",
          d.message,
        ].join("\n");

        try {
          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from: "Jepy Studio <noreply@jepystudio.com>",
              to: [TO],
              reply_to: d.email,
              subject: `New Brief from ${d.name}`,
              html,
              text,
            }),
          });
          if (!res.ok) {
            const body = await res.text();
            console.error("Resend send failed", res.status, body);
            return Response.json(
              { error: "Email send failed", status: res.status, detail: body.slice(0, 500) },
              { status: 502 },
            );
          }
        } catch (err) {
          console.error("Resend send error", err);
          return Response.json(
            { error: "Email send failed", detail: err instanceof Error ? err.message : String(err) },
            { status: 502 },
          );
        }

        return Response.json({ ok: true });
      },
    },
  },
});
