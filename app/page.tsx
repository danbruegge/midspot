"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CodeBracketIcon } from "@heroicons/react/20/solid";

import { MapView } from "./map-view";

const queryClient = new QueryClient();

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center py-24 md:px-24 gap-12">
      <header>
        <h1 className="text-4xl font-bold text-center">Places Between</h1>
      </header>
      <main className="">
        <QueryClientProvider client={queryClient}>
          <MapView />
        </QueryClientProvider>
      </main>
      <footer className="flex flex-col items-center gap-4 text-center text-white/50">
        <p>
          Crafted by{" "}
          <a
            href="https://danbruegge.com/"
            className="text-white/80 hover:text-primary text-sm"
          >
            Daniel Brüggemann
          </a>
        </p>
        <p>
          <a
            href="https://github.com/danbruegge/places-between"
            className="flex gap-2 items-center text-sm hover:text-primary"
          >
            <CodeBracketIcon className="size-5" />
            Code
          </a>
        </p>
      </footer>
    </div>
  );
}
