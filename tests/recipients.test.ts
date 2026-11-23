import { describe, it, expect } from "vitest";
import { parseRecipients } from "@/lib/recipients";

describe("parseRecipients", () => {
  it("valid va invalid manzillarni ajratadi", () => {
    expect(parseRecipients("a@b.uz, bad ,c@d.com")).toEqual({
      valid: ["a@b.uz", "c@d.com"],
      invalid: ["bad"],
    });
  });
  it("bo'sh satr", () => {
    expect(parseRecipients("  ")).toEqual({ valid: [], invalid: [] });
  });
  it("nuqtali vergul va yangi qator ham ajratadi, takrorni olib tashlaydi", () => {
    expect(parseRecipients("a@b.uz;a@b.uz\nc@d.com").valid).toEqual(["a@b.uz", "c@d.com"]);
  });
  it("sarlavha in'ektsiyasini rad etadi", () => {
    expect(parseRecipients("a@b.uz\r\nBcc: x@y.com").valid).toEqual(["a@b.uz"]);
  });
});
