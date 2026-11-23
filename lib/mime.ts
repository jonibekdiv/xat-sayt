function b64Lines(s: string): string {
  return (Buffer.from(s, "utf8").toString("base64").match(/.{1,76}/g) ?? []).join("\r\n");
}

export function buildRawMessage(p: {
  from: string;
  to: string[];
  subject: string;
  body: string;
}): string {
  const subject = p.subject.replace(/[\r\n]+/g, " ");
  const message = [
    `From: ${p.from}`,
    `To: ${p.to.join(", ")}`,
    `Subject: =?UTF-8?B?${Buffer.from(subject, "utf8").toString("base64")}?=`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    b64Lines(p.body),
  ].join("\r\n");
  return Buffer.from(message, "utf8").toString("base64url");
}
