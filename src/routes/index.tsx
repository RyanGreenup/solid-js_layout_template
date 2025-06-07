import { A } from "@solidjs/router";
import Counter from "~/components/Counter";

export default function Home() {
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
        Hello world!
      </h1>
      <Counter />

      <div class="my-8">
        <a
          href="/showcase"
          class="block max-w-sm mx-auto bg-white rounded-lg shadow-lg p-6 animate-pulse hover:animate-none hover:scale-105 hover:shadow-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-sky-50 hover:to-blue-50"
        >
          <div class="text-2xl font-bold text-sky-700 mb-2">🎨 Showcase</div>
          <p class="text-gray-600">Explore amazing Solid projects and examples</p>
        </a>
      </div>

      <p class="mt-8">
        Visit{" "}
        <a
          href="https://solidjs.com"
          target="_blank"
          class="text-sky-600 hover:underline"
        >
          solidjs.com
        </a>{" "}
        to learn how to build Solid apps.
      </p>
      <p class="my-4">
        <span>Home</span>
        {" - "}
        <A href="/about" class="text-sky-600 hover:underline">
          About Page
        </A>{" "}
      </p>
    </main>
  );
}
