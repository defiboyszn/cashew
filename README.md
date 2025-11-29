This is a [Next.js](https://nextjs.org/) project bootstrapped
with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

Backed route to sync minor data are stored by sending requests
to  [http://localhost:3000/api/wallet](http://localhost:3000/api/wallet). This endpoint can be edited
in `pages/api/wallet.ts`.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and
load Inter, a custom Google Font.

## Pushing updates

Always run:

```bash
npm run type:check
```

to confirm all types are in place before creating pull requests or pushing updates.