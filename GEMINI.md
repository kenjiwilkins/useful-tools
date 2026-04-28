1 # Useful Tools - Project Overview  
 2  
 3 A modern web application providing a collection of fast, free, and browser-based utilities for everyday tasks involving text, numbers, data, encoding, and development.  
 4  
 5 ## Core Technologies  
 6  
 7 - **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Static Generation)  
 8 - **Library**: [React 19](https://react.dev/)  
 9 - **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)  
 10 - **Icons**: [Lucide React](https://lucide.dev/)  
 11 - **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives)  
 12 - **Deployment**: Optimized for Vercel  
 13  
 14 ## Project Structure  
 15  
 16 - `app/`: Next.js App Router directory.  
 17 - `app/page.tsx`: Landing page with tool grid grouped by category.  
 18 - `app/tools/[slug]/page.tsx`: Dynamic route for rendering individual tools.  
 19 - `components/`: React components.  
 20 - `components/tools/`: Implementation files for specific tools (e.g., `string-comparison.tsx`).  
 21 - `components/ui/`: Reusable UI primitives (buttons, badges, etc.).  
 22 - `components/site-header.tsx` & `components/site-footer.tsx`: Layout-level components.  
 23 - `lib/`: Utility functions and data.  
 24 - `lib/tools.ts`: **Source of truth** for tool metadata (slug, title, category, icon, available status).  
 25  
 26 ## Development Workflow  
 27  
 28 ### Adding a New Tool  
 29  
 30 1. **Define Metadata**: Add the tool definition to the `tools` array in `lib/tools.ts`. Set `available: true` when ready.  
 31 2. **Implement UI**: Create a new component in `components/tools/` for the tool's logic and interface.  
 32 3. **Register Component**: Import and add the component to the `ToolRenderer` switch-case in `app/tools/[slug]/page.tsx`.  
 33 4. **Register Icon**: Add the corresponding Lucide icon to the `iconMap` in `components/tool-card.tsx`.  
 34  
 35 ### Commands  
 36  
 37 - `pnpm dev`: Run the development server.  
 38 - `pnpm build`: Create a production build (statically generated).  
 39 - `pnpm start`: Start the production server.  
 40 - `pnpm lint`: Run linting checks.  
 41  
 42 ## Conventions  
 43  
 44 - **Performance**: Tools should run entirely client-side whenever possible to ensure privacy and speed.  
 45 - **Styling**: Use Tailwind CSS 4 for all styling. Favor the `bg-background`, `text-foreground`, and `text-muted-foreground` variables for consistent theming.  
 46 - **Icons**: Always use `lucide-react` icons.  
 47 - **Static Generation**: The landing page and all tool pages are configured for static generation (`force-static`) to ensure optimal performance.
