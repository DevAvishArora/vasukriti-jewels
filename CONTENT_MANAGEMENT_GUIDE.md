# Content Management System - User Guide

## Overview
Your static pages (About Us, Brand Story, Why Choose Us) are now fully manageable from the Admin Dashboard! No more hardcoded content - you can edit everything through a user-friendly interface.

## What's Been Implemented

### ✅ Backend (API)
- **Database Model**: `PageContent` schema to store page content
- **API Endpoints**: Full CRUD operations for managing content
  - `GET /api/page-content` - Get all pages
  - `GET /api/page-content/:page` - Get specific page (about, brand-story, why-choose-us)
  - `POST /api/page-content` - Create new page (admin only)
  - `PUT /api/page-content/:page` - Update page (admin only)
  - `DELETE /api/page-content/:page` - Delete page (admin only)
  - `PATCH /api/page-content/:page/toggle` - Activate/deactivate page (admin only)

### ✅ Admin Dashboard
- **Location**: `/admin/cms/static` or `/admin/cms/brand-story`
- **Features**:
  - List all manageable pages
  - Edit page title, subtitle, and sections
  - Add/remove/reorder content sections
  - Toggle pages active/inactive
  - Real-time preview of changes
  - Support for multiple content types:
    - Headings
    - Paragraphs
    - Lists (bullet points)
    - Stats (numbers with labels)
    - Quotes (with attribution)

### ✅ Frontend Components
Updated to fetch content dynamically:
- **About Us Page** (`/about`)
- **Brand Story Section** (Home page)
- **Why Choose Us Section** (Home page)

### ✅ Initial Data
Default content has been seeded for:
- About Us
- Brand Story
- Why Choose Us
- Hero Section (placeholder)

## How to Use

### 1. Access the Content Manager
1. Login to admin dashboard: http://localhost:3000/admin
2. Click on "CMS" in the sidebar
3. Select the page you want to edit (e.g., "The Vasukriti Legacy" for brand story)

### 2. Edit a Page
1. Click the "Edit" button on any page card
2. Modify the title and subtitle
3. Edit existing sections or add new ones:
   - **Heading**: Large section titles
   - **Paragraph**: Body text
   - **List**: Bullet points or feature cards
   - **Stats**: Numbers with labels (e.g., "10+ Years", "50K+ Customers")
   - **Quote**: Highlighted quotes with attribution

### 3. Manage Sections
- **Add Section**: Click "+ Add Section" button
- **Remove Section**: Click trash icon on any section
- **Reorder Sections**: Use ↑ ↓ arrows to move sections up/down
- **Change Section Type**: Use dropdown to switch between types
- **Expand/Collapse**: Click chevron icon to show/hide section content

### 4. Save Changes
1. Make your edits
2. Click "Save Changes" (green button)
3. Changes are immediately visible on the website

### 5. Activate/Deactivate Pages
- Click the eye icon to toggle visibility
- Inactive pages won't show on the website
- Useful for hiding pages during updates

## Content Types Explained

### Heading
```
Type: Text
Use: Section titles
Example: "Our Story", "Our Values"
```

### Paragraph
```
Type: Text
Use: Body content, descriptions
Example: Company history, mission statement
```

### List
```
Type: Array of items
Use: Feature lists, bullet points

Simple Format (one item per line):
- Premium Quality
- Certified Authenticity
- Expert Craftsmanship

OR Structured Format (will show as cards with icons):
{
  "title": "Premium Quality",
  "description": "Every piece is certified",
  "icon": "shield"
}
```

### Stats
```
Type: Array of {value, label}
Use: Achievements, numbers

Example:
10+ | Years of Excellence
50,000+ | Happy Customers
5,000+ | Unique Designs
```

### Quote
```
Type: {text, author}
Use: Testimonials, featured quotes

Example:
Text: "Every piece tells a story..."
Author: "Founder, Vasukriti Jewels"
```

## Tips & Best Practices

### Content Writing
1. **Keep it concise**: Short paragraphs are easier to read
2. **Use headings**: Break content into logical sections
3. **Highlight features**: Use lists for key benefits
4. **Add stats**: Numbers build credibility
5. **Include quotes**: Add personality and trust

### SEO Optimization
Each page has metadata fields:
- **SEO Title**: Appears in search results (50-60 chars)
- **SEO Description**: Summary for search engines (150-160 chars)
- **Keywords**: Relevant search terms (currently not editable via UI)

### Performance
- Content is cached on the frontend
- Changes are reflected immediately after saving
- API calls are optimized for fast loading

## Common Tasks

### Update About Us Page
1. Go to `/admin/cms`
2. Click "About Us" card
3. Modify sections as needed
4. Click "Save Changes"
5. Visit `/about` to see changes

### Change Homepage Brand Story
1. Go to `/admin/cms`
2. Click "The Vasukriti Legacy" card
3. Update the content sections (first 3 paragraphs appear on homepage)
4. Save changes
5. Visit homepage to see updated content immediately

### Add New Features to "Why Choose Us"
1. Go to `/admin/cms`
2. Click "Why Choose Us" card
3. Add or edit feature items
4. Save changes
5. View on homepage

## Troubleshooting

### Changes not appearing?
- Make sure page is set to "Active" (green badge)
- Clear browser cache: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Check if backend is running: http://localhost:5001/health

### Can't save changes?
- Ensure you're logged in as admin
- Check browser console for errors
- Verify backend connection

### Content looks broken?
- Check that all sections have content
- Verify list items are properly formatted
- Use "Cancel" to revert unsaved changes

## API Testing

Test the API directly:

```bash
# Get all pages
curl http://localhost:5001/api/page-content

# Get specific page
curl http://localhost:5001/api/page-content/about

# Update page (requires admin token)
curl -X PUT http://localhost:5001/api/page-content/about \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "New Title"}'
```

## Future Enhancements

Possible additions:
- Image uploads for sections
- Rich text editor
- Preview mode before publishing
- Version history
- Bulk import/export
- Multi-language support
- Scheduled publishing

## Support

For issues or questions:
1. Check this guide
2. Review browser console for errors
3. Check backend logs
4. Contact support

---

**Last Updated**: January 12, 2026
**Version**: 1.0.0
