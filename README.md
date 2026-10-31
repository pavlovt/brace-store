# BraceML Store

A small online store, built twice to compare BraceML with HTML templates:

- **frontend/** – SvelteKit 2 + Svelte 5 (runes), [BraceML](https://github.com/pavlovt/braceml) templates, Tailwind CSS v4, adapter-node. Runs on http://localhost:5173
- **frontend-html/** – the same app with the original Svelte HTML markup. Run it with `npm run dev:html`
- **backend/** – NestJS 11 + Prisma 7 + SQLite (`backend/store.sqlite`). API on http://localhost:3000/api

On first start the backend seeds the database from https://fakestoreapi.com/products
(if that fails, it falls back to 4 bundled sample products).

## BraceML vs HTML

This repo holds the same storefront twice, so you can compare the two template styles:

| Folder | Templates |
|---|---|
| [`frontend/`](frontend) | [BraceML](https://github.com/pavlovt/braceml) in `<template lang="braceml">` blocks |
| [`frontend-html/`](frontend-html) | The original Svelte HTML markup |

The `<script>` blocks, styles, routes and backend are identical. Only the markup differs.
To compare the versions, run `diff -ru frontend/src frontend-html/src`, or open a file in both folders.

Markup size per component, excluding `<script>` and ignoring indentation and blank lines:

| Component | HTML lines | BraceML lines | HTML chars | BraceML chars | Chars |
|---|---:|---:|---:|---:|---:|
| [ProductCard](frontend/src/lib/ProductCard.svelte) | 22 | 16 | 1,119 | 1,054 | −6% |
| [Rating](frontend/src/lib/Rating.svelte) | 7 | 10 | 426 | 402 | −6% |
| [+error](frontend/src/routes/+error.svelte) | 15 | 13 | 675 | 628 | −7% |
| [+layout](frontend/src/routes/+layout.svelte) | 26 | 24 | 1,277 | 1,195 | −6% |
| [Shop](frontend/src/routes/+page.svelte) | 35 | 37 | 2,086 | 1,918 | −8% |
| [Cart](frontend/src/routes/cart/+page.svelte) | 76 | 80 | 3,977 | 3,680 | −7% |
| [Orders](frontend/src/routes/orders/+page.svelte) | 29 | 34 | 1,458 | 1,312 | −10% |
| [Order detail](frontend/src/routes/orders/%5Bid%5D/+page.svelte) | 42 | 48 | 2,195 | 2,014 | −8% |
| [Product detail](frontend/src/routes/product/%5Bid%5D/+page.svelte) | 27 | 30 | 1,875 | 1,739 | −7% |
| **Total** | **279** | **292** | **15,088** | **13,942** | **−8%** |

BraceML saves 8% of the characters, mostly closing tags, but uses 13 more lines, because each
child goes on its own line where the HTML sometimes fits several on one. Long Tailwind class
lists account for much of the text in both versions, so a project with shorter markup would see
a different result.

Here is the same table row in each version:

```svelte
<td class="px-4 py-3"><a class="text-brand-700 hover:underline" href="/orders/{o.id}">View</a></td>
```

```braceml
td class="px-4 py-3" > a class="text-brand-700 hover:underline" href="/orders/{o.id}" 'View'
```

### Trade-offs

- **Build output:** both versions produce the same pages. The only differences in the compiled
  markup are `class={x}` becoming `class="{x}"`, and whitespace between table cells and flex items
  that the browser ignores.
- **Type checking:** `npm run check` works in `frontend-html/` only. See [BraceML templates](#braceml-templates).
- **Tooling:** HTML has the full Svelte language server. BraceML has highlighting and shows
  errors while typing, but templates in `.svelte` files get no autocomplete.

## BraceML templates

Component markup lives in `<template lang="braceml">` blocks, compiled by the preprocessor in
`frontend/svelte.config.js`. `src/app.html` stays HTML because it is SvelteKit's page shell.

- Write Tailwind classes in `class="..."`, not as selectors (`.mb-4`). Tailwind scans the
  source files and doesn't detect selector classes, so they get no CSS.
- `npm run check` doesn't work on these components, because `svelte-check` reads the
  BraceML block as Svelte markup. Template expressions aren't type-checked.

## Run (Windows / macOS / Linux, Node 20.19+ or 22+)

```bash
git clone https://github.com/pavlovt/brace-store.git
cd brace-store
npm run install:all
npm run dev
```

Open http://localhost:5173.

To run the HTML version instead (run only one version at a time, because both use port 5173):

```bash
npm run install:html
npm run dev:html
```

`npm run dev` applies Prisma migrations, starts the API in watch mode and the SvelteKit dev server together.

## Start only the backend

Open a terminal in the backend folder and run these in order:

```bash
cd backend

# 1. Install dependencies (also runs `prisma generate` to build the Prisma client)
npm install

# 2. Start the API in watch mode
#    (this first runs `prisma migrate deploy`, which creates store.sqlite and its tables)
npm run start:dev
```

On first start the backend fills the database with products from fakestoreapi.com.
The API is then at http://localhost:3000/api. Check it with http://localhost:3000/api/products.

Only step 2 is needed on later runs. Run `npm install` again only if `package.json` changes.

Optional:

```bash
npm run db:studio   # browse the data in Prisma Studio
npm run db:reset    # wipe the database; it re-seeds on the next start
```

To run a production build instead of watch mode:

```bash
npm run build
npm run start:prod
```

To use a different port or database file, copy `.env.example` to `.env` and set `PORT` / `DATABASE_URL`.

## API

| Method | Path | Notes |
|---|---|---|
| GET | /api/products?category=&search=&sort=price_asc\|price_desc\|rating | list |
| GET | /api/products/:id | one product |
| GET | /api/categories | distinct categories |
| POST | /api/products/reseed | re-fetch products from fakestoreapi.com |
| POST | /api/orders | `{customerName, customerEmail, items:[{productId, quantity}]}` — prices/total computed server-side |
| GET | /api/orders, /api/orders/:id | orders |

## Useful backend scripts (run inside `backend/`)

- `npm run db:studio` – browse the SQLite data in Prisma Studio
- `npm run db:reset` – drop and recreate the database (re-seeds on next start)
- `npm run db:migrate -- --name <change>` – create a migration after editing `prisma/schema.prisma`

## Production-style run

```bash
npm run build
cd backend && npm run start:prod
cd frontend && set ORIGIN=http://localhost:3001&& set PORT=3001&& node build
```

`ORIGIN` must match the URL you open, or SvelteKit rejects the checkout form POST. Set `API_URL` in the frontend if the API isn't at http://localhost:3000/api.
