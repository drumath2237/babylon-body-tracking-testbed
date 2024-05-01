import basicSsl from "@vitejs/plugin-basic-ssl";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  if (mode === "production") {
    return {
      base: "/babylon-body-tracking-testbed/",
    };
  } else {
    return {
      plugins: [basicSsl()],
    };
  }
});
