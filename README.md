# OOTD AI: Fashion Stylist Chatbot

An AI stylist chatbot that builds outfits from your own digital wardrobe. Tell it the occasion or the vibe, and it puts together a look from the clothes you already own.

Prototyped with [Google AI Studio](https://aistudio.google.com/) and Gemini.

![Digital Wardrobe](docs/screenshots/wardrobe.png)

## Features

- **AI Stylist**: chat in plain language to get outfit ideas for any occasion
- **Historic Chats**: every styling session is saved and can be restored
- **Digital Wardrobe**: browse your closet by category (clothing, shoes, bags, accessories) and add new items
- **Inspiration Hub**: curated style boards with a "Match Against My Wardrobe" button
- **Saved Outfits**: keep favourite outfits and organise them into fashion boards
- **Wear Logs**: track what you wore, when, and for which occasion
- **Profile**: personal style notes and colour rules (for example "prefers beige, cream, dark neutrals; avoids neon")
- **Settings**: language, light/dark mode, accent colours, and a reset for the demo data

## Screenshots

| Inspiration Hub | Saved Outfits |
| --- | --- |
| ![Inspiration Hub](docs/screenshots/inspiration-hub.png) | ![Saved Outfits](docs/screenshots/saved-outfits.png) |

| Wear Logs | Dark mode |
| --- | --- |
| ![Wear Logs](docs/screenshots/wear-logs.png) | ![Settings in dark mode](docs/screenshots/settings-dark.png) |

## Tech Stack

- React + TypeScript
- Vite
- Node.js server (`server.ts`)
- Google Gemini API

## Getting Started

**Prerequisites:** Node.js 18 or newer and a [Gemini API key](https://aistudio.google.com/apikey).

1. Clone the repo:
   ```bash
   git clone https://github.com/mngadisamu/ootd-ai-chatbot.git
   cd ootd-ai-chatbot
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your environment file:
   ```bash
   cp .env.example .env
   ```
   Then open `.env` and set `GEMINI_API_KEY` to your key.
4. Start the app:
   ```bash
   npm run dev
   ```
5. Open the local URL shown in your terminal.

> Never commit your `.env` file. It is listed in `.gitignore`.

## Demo Data

The wardrobe, saved outfits, and wear logs you see in the screenshots are sample data. Use **Settings → Reset Demo Data** to restore them at any time.
