"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CodeBracketIcon } from "@heroicons/react/20/solid";

import { MapView } from "./map-view";

const queryClient = new QueryClient();

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center py-24 md:px-24 gap-12">
      <header>
        <p>Let&apos;s find a</p>
        <h1 className="mx-2 text-4xl text-primary font-bold italic text-center">
          Midspot
        </h1>
        <p className="text-right">to meet!</p>
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
            href="https://github.com/danbruegge/midspot"
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
