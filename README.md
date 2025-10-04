# Quote Image Generator

A web service that automatically places quotes on template images with predefined typography and emails them for Instagram posting.

## Features
- Simple text input interface
- Multiple pre-designed templates
- Automatic typography application
- Email delivery via Mailgun
- 30-day automatic cleanup
- Optimized for Instagram (1080x1080)

## Project Structure

This project follows a clear separation between frontend and backend concerns:

```
picassos-secretary/
├── frontend/          # 🎨 Next.js Frontend (UI, components, pages)
├── backend/           # ⚙️ Backend Services (business logic, processing)
├── shared/            # 🔄 Shared Code (constants, types)
├── public/            # 📁 Static Assets (fonts, templates, images)
└── docs/              # 📚 Documentation
```

**Key Questions Answered:**
- **Is there a frontend and a backend?** → Yes, clearly separated in `/frontend/` and `/backend/`
- **Why are service files inside lib?** → They're now properly organized by purpose in `/backend/services/`

See [Architecture Documentation](./docs/architecture.md) for detailed information.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env.local`

3. Add your template images to `/public/templates/`

4. Run development server:
   ```bash
   npm run dev
   ```

5. Deploy to Vercel:
   ```bash
   vercel
   ```

## Template Specifications
- Size: 1080x1080px
- Format: JPG
- Style: Dark, minimalist backgrounds as per design brief

## Typography Settings
- Main Quote: Jost Medium
- Bold Text: Jost Bold
- Text Color: #F5F2ED
- Accent Color: #8B7355
