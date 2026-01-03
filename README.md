# 🧁 Axolotl Kitchen

A mobile-first inventory and sales tracking app for a small home bakery.

Axolotl Kitchen helps track ingredients, production lots, and sales with a clean UI and a secure backend powered by Supabase. The project is designed to be simple, auditable, and safe to operate on a phone.

---

## ✨ Features

- 📦 Ingredient inventory tracking with expiry dates
- 🧁 Product lot creation from ingredients
- 💰 Sales recording (one lot sold once)
- 🚫 Mark ingredients as “over” when expired or discarded
- 🔐 Email-based authentication (magic links)
- 🧠 Authorization via database-level Row Level Security (RLS)
- 📱 Mobile-first UI (portrait layout)

---

## 🏗 Architecture

### Frontend
- **React + TypeScript**
- **Vite** for fast builds
- **Chakra UI v3** (migration in progress)
- State-driven component refresh via parent-controlled versioning
- Hosted on **Vercel**

### Backend
- **Supabase**
  - PostgreSQL database
  - Supabase Auth (Magic Link / OTP)
  - Row Level Security (RLS) for authorization
  - Views for derived data (sales history, availability, etc.)

---

## 🗄 Database Schema
https://supabase.com/dashboard/project/syphxzwnaugskucnnsve

### Tables

| Table | Purpose |
|------|--------|
| `ingredients` | Raw ingredients with expiry and status |
| `product_lots` | Produced batches (cookies, cakes, etc.) |
| `lot_ingredients` | Mapping between lots and ingredients |
| `sales` | Records of sold product lots |
| `allowed_users` | Whitelist of emails allowed to access data |

> 🔐 Access to all business tables is gated by RLS policies that check membership in `allowed_users`.

---

## 🔐 Authentication & Authorization

### Authentication
- Email-based **Magic Link (OTP)** using Supabase Auth
- No passwords stored or managed by the app

### Authorization
- Enforced **entirely in the database**
- Only users whose email exists in `allowed_users` can:
  - Read data
  - Insert records
  - Update or delete rows

> Allowed emails are **never exposed** in frontend code.

---

## 🔒 Security Design Principles

- No secrets committed to GitHub
- `.env` files are gitignored
- Supabase anon key is used client-side (as intended)
- All sensitive logic enforced via RLS, not UI checks
- Policies are defined per action (SELECT / INSERT / UPDATE / DELETE)

---

## 🚀 Deployment

- **Frontend**: Vercel  @ https://vercel.com/sudarsanyes-projects/axolotl-kitchen/deployments
- **Backend**: Supabase @ https://supabase.com/dashboard/project/syphxzwnaugskucnnsve

The app is built as a static frontend and deployed via Vercel’s standard React/Vite pipeline.

---

## 🧪 Development Setup

### Prerequisites
- Node.js 18+
- Supabase project

### Install
```bash
npm install

### Run locally
npm run dev

### NOTE: Envronment file .env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
⚠️ Never commit .env files.

