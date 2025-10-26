'use client';

export default function Header({ user }: { user: any }) {
  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            Welcome, {user.name || user.email}
          </h2>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
