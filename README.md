# MEC Event Portal

A web-based event management portal for MEC (Model Engineering College), allowing students to browse events, register, and manage their participation — with coordinator tools for event administration.

## Overview

The MEC Event Portal is a React-based single-page application backed by Supabase for authentication and data storage. Students can explore college events and clubs, register for events, and view their dashboard. Coordinators have a dedicated view to manage events and participants. The app is also configured as a Progressive Web App (PWA) for offline capability.

## Features

- **Event Browsing**: Browse all MEC events with details, dates, and club associations.
- **User Authentication**: Supabase-powered auth with protected registration flows.
- **Event Registration**: Register for events and track them in a personal dashboard.
- **Coordinator View**: An admin panel for coordinators to manage events.
- **Clubs Directory**: Browse student clubs at MEC.
- **PDF Generation**: Export event-related information using jsPDF.
- **PWA Support**: Installable as a Progressive Web App.
- **Smooth Animations**: Page transitions via Framer Motion.

## Tech Stack

- **Framework**: React 19, Vite
- **Backend/Auth**: Supabase (PostgreSQL)
- **Animations**: Framer Motion
- **PDF**: jsPDF, html2canvas
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- A [Supabase](https://supabase.com/) account and project

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/danyl-dnl/mec-events.git
   cd mec-events
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables by copying the example file:
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase project URL and anonymous key in `.env`.

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous/public key |

## Running Locally

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Database Setup

The `supabase-setup.sql` file in the root contains the SQL schema to set up the required tables. Run it in your Supabase SQL editor before using the app.

## Project Structure

- `src/views/`: Page-level views (Home, Events, Clubs, Dashboard, Coordinator)
- `src/components/`: Reusable components (Header, Footer, Modals)
- `src/context/`: React context for auth state
- `src/data/`: Mock event data and database constants
- `src/lib/`: Supabase client configuration
