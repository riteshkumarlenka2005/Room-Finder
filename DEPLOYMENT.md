# Deployment Guide

This project is a Next.js application using Supabase / Prisma. It is ready for deployment on Vercel.

## Prerequisites

1.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com).
2.  **Supabase Project**: Ensure you have your Supabase URL and Anon Key.

## Environment Variables

Ensure the following environment variables are set in your deployment environment (e.g., Vercel Project Settings):

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
# Add any other required keys from your .env file
```

## Deployment Steps (Vercel)

1.  **Push to GitHub**: Ensure your code is pushed to a GitHub repository.
2.  **Import to Vercel**:
    *   Go to Vercel Dashboard -> "Add New..." -> "Project".
    *   Select your GitHub repository.
3.  **Configure Project**:
    *   **Framework Preset**: Next.js (should be auto-detected).
    *   **Build Command**: `next build` (default).
    *   **Install Command**: `pnpm install` (default, if pnpm-lock.yaml is detected).
    *   **Environment Variables**: Add the variables mentioned above.
4.  **Deploy**: Click "Deploy".

## Build Verification

The project has been verified to build successfully with `pnpm build`.
Linting errors have been resolved to ensure a smooth build process.

## Common Issues

*   **Lint Errors**: If the build fails due to linting, check the build logs. We have optimized strictness, but future code changes might trigger new warnings.
*   **Database Connection**: Ensure your production environment can access your Supabase instance.
