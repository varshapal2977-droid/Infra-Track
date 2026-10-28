
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import path from "node:path";

export default defineConfig({
  tanstackStart: {
    // Keep your existing SSR server entry.
    server: { entry: "server" },
  },
  vite: {
    server: {
      fs: {
        allow: [path.resolve(".")],
      },
    },
  },
});
