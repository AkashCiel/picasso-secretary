# Quote Image Generator

A web service that automatically places quotes on template images with predefined typography and emails them for Instagram posting.

## Features
- Simple text input interface
- Multiple pre-designed templates
- Automatic typography application
- Email delivery via Mailgun
- 30-day automatic cleanup
- Optimized for Instagram (1080x1080)

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
- Main Quote: Futura PT Light
- Attribution: Garamond Italic
- Text Color: #F5F2ED
- Accent Color: #8B7355
