import { describe, it, expect, vi, beforeEach } from "vitest";

const authMock = vi.fn();
vi.mock("@/auth", () => ({ auth: () => authMock() }));

import { POST } from "@/app/api/send/route";

const req = (body: unknown) =>
  new Request("http://x/api/send", { method: "POST", body: JSON.stringify(body) });

describe("POST /api/send", () => {
  const fetchMock = vi.fn();
  beforeEach(() => {
    fetchMock.mockReset().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    authMock.mockReset();
  });

  it("sessiyasiz 401", async () => {
    authMock.mockResolvedValue(null);
    expect((await POST(req({ to: "a@b.uz", subject: "s", body: "b" }))).status).toBe(401);
  });

  it("RefreshFailed bo'lsa 401", async () => {
    authMock.mockResolvedValue({ user: { email: "m@g.com" }, accessToken: "t", error: "RefreshFailed" });
    expect((await POST(req({ to: "a@b.uz", subject: "s", body: "b" }))).status).toBe(401);
  });

  it("noto'g'ri manzil 400 va Gmail chaqirilmaydi", async () => {
    authMock.mockResolvedValue({ user: { email: "m@g.com" }, accessToken: "t" });
    const res = await POST(req({ to: "a@b.uz, bad", subject: "s", body: "b" }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toContain("bad");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("bo'sh manzil/matn 400", async () => {
    authMock.mockResolvedValue({ user: { email: "m@g.com" }, accessToken: "t" });
    expect((await POST(req({ to: "", subject: "s", body: "b" }))).status).toBe(400);
    expect((await POST(req({ to: "a@b.uz", subject: "s", body: "  " }))).status).toBe(400);
  });

  it("2 ta valid manzilga 2 marta yuboradi", async () => {
    authMock.mockResolvedValue({ user: { email: "m@g.com" }, accessToken: "tok" });
    const res = await POST(req({ to: "a@b.uz, c@d.com", subject: "s", body: "b" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ sent: 2 });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://gmail.googleapis.com/gmail/v1/users/me/messages/send");
    expect(init.headers.Authorization).toBe("Bearer tok");
  });

  it("Gmail xato qaytarsa 502", async () => {
    authMock.mockResolvedValue({ user: { email: "m@g.com" }, accessToken: "t" });
    fetchMock.mockResolvedValue(new Response("{}", { status: 403 }));
    expect((await POST(req({ to: "a@b.uz", subject: "s", body: "b" }))).status).toBe(502);
  });
});
