import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (session?.user && !session.error) redirect("/yozish");
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-4 py-12">
      <div className="rounded-3xl border border-line bg-card/80 p-8 shadow-xl backdrop-blur sm:p-10">
        <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl text-2xl text-white"
             style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}>
          ✉
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Istalgan emailga <span className="text-accent">xat yuboring</span>
        </h1>
        <p className="mt-3 text-muted">
          Google bilan kiring va xatni o&apos;z Gmail manzilingizdan yuboring. Qabul qiluvchi
          saytda ro&apos;yxatdan o&apos;tgan bo&apos;lishi shart emas.
        </p>

        {(error || session?.error) && (
          <p role="alert" className="mt-5 rounded-xl border border-line px-4 py-3 text-sm" style={{ color: "var(--err)" }}>
            Kirib bo&apos;lmadi. Qayta urinib ko&apos;ring. Agar xato takrorlansa, emailingiz
            test foydalanuvchilar ro&apos;yxatiga qo&apos;shilmagan bo&apos;lishi mumkin.
          </p>
        )}

        <form
          className="mt-8"
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/yozish" });
          }}
        >
          <button type="submit" className="btn-primary flex w-full items-center justify-center gap-3">
            <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden>
              <path fill="#fff" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/>
            </svg>
            Google bilan kirish
          </button>
        </form>
        <p className="mt-4 text-xs text-muted">
          Faqat xat yuborish ruxsati so&apos;raladi. Pochtangizni o&apos;qimaymiz va xatlarni saqlamaymiz.
        </p>
      </div>
    </main>
  );
}
