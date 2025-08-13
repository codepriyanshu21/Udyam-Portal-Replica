# Udyam Registration Replica

> This project is a **replica of the Udyam Registration portal** built with [Next.js](https://nextjs.org/), React, and TypeScript. It demonstrates a multi-step registration form for MSMEs (Micro, Small, and Medium Enterprises) in India, including Aadhaar and PAN verification steps, with a modern UI using Tailwind CSS.

---

## Features

- Multi-step registration form (Aadhaar Verification, PAN Verification)
- Real-time form validation and progress tracking
- Modern, responsive UI with Tailwind CSS
- Mocked OTP and PAN verification flows for demo purposes
- Component-based architecture for easy extension
- Unit and integration tests with Jest and Testing Library

## Folder Structure

- `app/` — Next.js app directory (main pages, API routes)
- `components/` — UI and form step components
- `lib/` — Validation logic and utilities
- `__tests__/` — Unit and integration tests
- `udyam-form-schema.json` — JSON schema for form steps and validation
- `scripts/` — SQL and scraping scripts (for demo/testing)

## Getting Started

Install dependencies:

```bash
npm install
# or
yarn install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to use the app.

## Testing

Run all tests:

```bash
npm test
# or
yarn test
```

## Main Form Steps

1. **Aadhaar Verification**: Enter Aadhaar number and mobile, receive and verify OTP.
2. **PAN Verification**: Enter PAN, name as per PAN, and date of birth. PAN details are validated.

All validation logic is in `lib/validation.ts` and form structure in `udyam-form-schema.json`.

## Technologies Used

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Jest & Testing Library

## Disclaimer

This project is for demonstration and educational purposes only. It is **not affiliated with or endorsed by any government entity**. No real Aadhaar or PAN data is processed.

---

© 2024 Government of India (Replica Demo). All rights reserved.
