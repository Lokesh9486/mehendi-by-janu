This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Admin studio

The studio admin lives at **`/admin`** (sign-in at `/admin/login`).

Seeded credentials, created the first time the local database is opened:

```
email:    janu@mehandi.com
password: admin@123
```

Change the password from the admin **Password** screen after the first sign-in.
The seed can be overridden with `ADMIN_EMAIL` / `ADMIN_PASSWORD` before the
database is created for the first time.

What the admin area does:

- **Gallery** — the whole `/gallery` grid is database-backed. The designs the
  site shipped with are imported into SQLite on first run, so every item can be
  edited (title, description, category), given a new photograph, or deleted.
  New uploads join the same grid and appear on the home page automatically.
- **Contact** — set the phone number, WhatsApp number (country code, digits
  only), and Instagram profile. The footer, contact section, business JSON-LD,
  and the WhatsApp enquiry form all read these saved details.
- **Password** — change the password using the current password, new password,
  and confirmation.
- **Single session** — only one admin session can be active. Signing in on a
  second device ends the first, and the old dashboard returns to the sign-in
  screen automatically.

How it is wired:

- SQLite database and uploaded images are stored on the backend machine in
  **`.data/`** (`mehandi.db` and `uploads/`). The folder is git-ignored.
  Set `MEHANDI_DATA_DIR` to store them somewhere else.
- Login and password-change payloads are encrypted in the browser with an
  RSA-OAEP public key (`/api/admin/handshake`) and decrypted on the server, so
  the email and password never travel as readable JSON. TLS is still required
  in production.
- Passwords are stored as salted scrypt hashes.
- Image uploads accept JPG, PNG, or WebP up to 8 MB, are checked by MIME type
  and file signature, and are served from `/api/gallery/image/<file>`.
- Contact details are stored in the `site_contact` table and exposed through
  the public `GET /api/site-contact` endpoint. The admin screen saves them with
  `GET`/`PUT /api/admin/site-contact`.
- Built-in designs use their original `/images/...` files; deleting one removes
  only its gallery row, not the asset used elsewhere on the site.

> Because uploads and the database live on local disk, deploy the app on a host
> with a persistent filesystem (a VPS or self-hosted server). A serverless host
> with an ephemeral filesystem will lose uploads and the database between
> deploys.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
