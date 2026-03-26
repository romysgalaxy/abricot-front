# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Abricot Front is a project/task management web application built with Next.js 15 (App Router) and React 19. The UI is entirely in French.

## Commands

- **Dev server**: `npm run dev` (runs on localhost:3000, proxies API to localhost:8000 via next.config.js rewrites)
- **Build**: `npm run build`
- **Start production**: `npm start`
- **Lint**: `npm run lint`

## Architecture

- **Plain JavaScript** (no TypeScript), Next.js App Router
- **Routing**: File-based routing in `app/` directory
  - `app/(auth)/` — public pages (login, signup) wrapped with `PublicGuard`
  - `app/(protected)/` — authenticated pages wrapped with `PrivateGuard` via layout
  - Route groups `(auth)` and `(protected)` share different layouts
- **State management**: React Context API (`context/AuthContext.js`) for auth (user, token, login/logout). All other state is local to page components via `useState`
- **Auth guards**: `components/AuthGuard.js` — `PrivateGuard` and `PublicGuard` client components using `useEffect` + `useRouter` for redirects
- **API layer**: `services/api.js` — all backend calls use the Fetch API with Bearer token auth from localStorage. Responses follow `{ data, message? }` shape. Base paths: `/auth`, `/projects`, `/dashboard`, `/users`
- **Token persistence**: JWT stored in `localStorage`
- **All pages are client components** (`'use client'`) since they depend on localStorage for auth

## Key Conventions

- **CSS Modules**: Every component/page uses `.module.css` files with bracket notation for hyphenated class names: `styles['class-name']`
- **Shared modal styles**: `CreateTaskModal` imports `CreateProjectModal.module.css` for shared modal base styles
- **Locale**: All user-facing text is in French, dates use `fr-FR` formatting
- **Task statuses**: `TODO`, `IN_PROGRESS`, `DONE`, `CANCELLED`

## Backend Dependency

The app requires a backend running on `localhost:8000`. API routes are proxied via `next.config.js` rewrites covering `/auth/*`, `/projects/*`, `/dashboard/*`, `/users/*`.
