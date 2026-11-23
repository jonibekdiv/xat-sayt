import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import ComposeForm from "@/components/ComposeForm";

export default async function Yozish() {
  const session = await auth();
  if (!session?.user || session.error) redirect("/?error=1");

  return (
    <main className="mx-auto min-h-dvh max-w-2xl px-4 py-8 sm:py-14">
      <header className="mb-6 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wider text-muted">Yuboruvchi</p>
          <p className="truncate font-medium">{session.user.email}</p>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button className="rounded-xl border border-line px-4 py-2 text-sm text-muted hover:text-fg">
            Chiqish
          </button>
        </form>
      </header>
      <div className="rounded-3xl border border-line bg-card/80 p-5 shadow-xl backdrop-blur sm:p-8">
        <h1 className="mb-5 text-2xl font-bold tracking-tight">Yangi xat</h1>
        <ComposeForm />
      </div>
    </main>
  );
}
