import { describe, it, expect } from "vitest";
import { buildRawMessage } from "@/lib/mime";

const decode = (raw: string) => Buffer.from(raw, "base64url").toString("utf8");

describe("buildRawMessage", () => {
  const raw = buildRawMessage({
    from: "men@gmail.com",
    to: ["a@b.uz"],
    subject: "Salom, dunyo 👋 o'zbek",
    body: "Assalomu alaykum!\nQalaysiz? ўқ",
  });
  const text = decode(raw);
  it("sarlavhalar", () => {
    expect(text).toContain("From: men@gmail.com");
    expect(text).toContain("To: a@b.uz");
    expect(text).toMatch(/Subject: =\?UTF-8\?B\?[A-Za-z0-9+/=]+\?=/);
    expect(text).toContain("Content-Type: text/plain; charset=UTF-8");
  });
  it("mavzu UTF-8 dan to'g'ri qaytadi", () => {
    const m = text.match(/Subject: =\?UTF-8\?B\?([^?]+)\?=/)!;
    expect(Buffer.from(m[1], "base64").toString("utf8")).toBe("Salom, dunyo 👋 o'zbek");
  });
  it("matn UTF-8 base64 da", () => {
    const body = text.split("\r\n\r\n")[1].replace(/\r\n/g, "");
    expect(Buffer.from(body, "base64").toString("utf8")).toBe("Assalomu alaykum!\nQalaysiz? ўқ");
  });
});
