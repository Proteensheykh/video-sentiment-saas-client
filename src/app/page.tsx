"use server"

import { SignOutButton } from "~/components/client/signout";

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="flex h-16 items-center justify-between border-b border-gray-200 px-10">
          <div className="flex items-center gap-2">
              <div className="flex h-8 justify-center rounded-md bg-gray-800 text-white p-1">
                  SA
              </div>
              <span className="text-lg font-medium">Sentiment Analysis</span>
          </div>
          <SignOutButton />
      </nav>
    </div>
  );
}
