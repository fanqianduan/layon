/**
 * https://cn.vitejs.dev/
 */

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    envPrefix: ["APP_"],
    plugins: [react()],
    server: {
        host: "0.0.0.0",
        open: true,
    },
});
