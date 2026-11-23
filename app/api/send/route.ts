import { auth } from "@/auth";
import { buildRawMessage } from "@/lib/mime";
import { parseRecipients } from "@/lib/recipients";

const MAX_RECIPIENTS = 50;

const json = (data: unknown, status = 200) => Response.json(data, { status });

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.accessToken || !session.user?.email || session.error) {
    return json({ error: "Qayta kiring: sessiya tugagan." }, 401);
  }

  let payload: { to?: string; subject?: string; body?: string };
  try {
    payload = await request.json();
  } catch {
    return json({ error: "So'rov noto'g'ri." }, 400);
  }

  const { valid, invalid } = parseRecipients(String(payload.to ?? ""));
  if (invalid.length) {
    return json({ error: `Noto'g'ri email: ${invalid.join(", ")}` }, 400);
  }
  if (!valid.length) return json({ error: "Kamida bitta email kiriting." }, 400);
  if (valid.length > MAX_RECIPIENTS) {
    return json({ error: `Bir martada ${MAX_RECIPIENTS} tadan ko'p emas.` }, 400);
  }
  const body = String(payload.body ?? "");
  if (!body.trim()) return json({ error: "Xat matni bo'sh." }, 400);
  const subject = String(payload.subject ?? "").trim() || "(mavzusiz)";

  let sent = 0;
  for (const to of valid) {
    const raw = buildRawMessage({ from: session.user.email, to: [to], subject, body });
    const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw }),
    });
    if (!res.ok) {
      const hint = res.status === 401 || res.status === 403 ? " Qayta kirib ko'ring." : "";
      return json({ error: `Yuborib bo'lmadi (${to}). Yuborilgan: ${sent}.${hint}`, sent }, 502);
    }
    sent++;
  }
  return json({ sent });
}
