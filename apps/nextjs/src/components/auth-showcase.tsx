import { auth, signIn, signOut } from "@reservue/auth";

export async function AuthShowcase() {
  const session = await auth();

  if (!session) {
    return (
      <div className="flex justify-center gap-2 text-white">
        <form
          action={async () => {
            "use server";
            await signIn("facebook");
          }}
        >
          <button className="rounded-full bg-black px-10 py-3 font-semibold no-underline transition hover:bg-white/20">
            Sign in with Facebook
          </button>
        </form>
        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <button className="rounded-full bg-black px-10 py-3 font-semibold no-underline transition hover:bg-white/20">
            Sign in with Google
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {session && <span>Logged in as {session.user.name}</span>}
      </p>

      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20">
          Sign out
        </button>
      </form>
    </div>
  );
}
