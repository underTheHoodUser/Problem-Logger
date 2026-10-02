<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Anime Design Pattern (Strict Rule)
This project follows a highly specific, vibrant **Shonen Anime / Neobrutalist UI** design pattern. Agents MUST adhere to the following rules when modifying or creating any UI components:

1. **Borders & Shadows**: All primary containers, buttons, and inputs MUST have thick black borders (e.g., `border-4 border-black`) and hard, solid-color drop shadows (e.g., `shadow-[6px_6px_0_0_#000]`). Hover states should usually increase or shift the shadow (e.g., `hover:shadow-[2px_2px_0_0_#000] hover:translate-y-1`).
2. **Typography**: Use the `Nunito` font (`font-sans`). Headings and buttons MUST be bold/black, uppercase, and italicized (e.g., `font-black uppercase italic`).
3. **Colors**: Use vibrant, saturated "comic" colors heavily contrasting with white/slate-50 backgrounds. 
   - Cyan: `bg-cyan-400`
   - Pink: `bg-pink-500`
   - Yellow: `bg-yellow-400`
   - Specific Chip Colors: `bg-green-400` (Low/Dhoom), `bg-yellow-400` (Medium/Chuddi), `bg-red-400 text-white` (High/Dhoom Chuddi).
4. **Shapes & Slants**: Use `transform skew-x-12` or `-rotate-6` on accents, badges, or icons to give a dynamic, action-oriented feel. Do not use standard rounded, soft-shadow corporate UI.
5. **Background**: The app has a subtle halftone dot background. Do not override this with gradients or plain backgrounds in standard containers without maintaining the overall comic aesthetic.
