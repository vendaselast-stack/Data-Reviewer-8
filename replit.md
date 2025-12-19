# HUA - Consultoria e Análise | Project Documentation

## Project Overview

**Application Name**: HUA - Consultoria e Análise  
**Purpose**: Financial consulting and analysis dashboard platform  
**Status**: MVP - Financial Dashboard Complete  
**Last Updated**: 2025-12-19

## Brand Identity

### Logo
- File: `attached_assets/Logo_HUA_1766180130167.png`
- Design: Yellow dollar sign on blue globe with white "HUA" text
- Tagline: "CONSULTORIA E ANÁLISE"

### Brand Colors

| Color | Hex | HSL | Usage |
|-------|-----|-----|-------|
| Primary (Royal Blue) | #0066CC | 210° 100% 40% | Headers, primary text, buttons, key metrics |
| Secondary (Golden Yellow) | #FFB800 | 39° 100% 50% | Accents, highlights, icons, emphasis |
| Success | - | 120° 70% 50% | Positive trends, success states |
| Warning | - | 35° 100% 50% | Alerts and warnings |
| Danger | - | 0° 100% 50% | Negative trends, errors |

## Project Architecture

### Frontend Structure
- **Framework**: React + Vite
- **Routing**: Wouter
- **State Management**: TanStack React Query
- **UI Components**: Shadcn (custom components)
- **Styling**: Tailwind CSS + Custom CSS variables
- **Icons**: Lucide React

### Directory Structure
```
client/src/
├── components/
│   ├── ui/                    # Shadcn base components
│   ├── kpi-card.tsx          # Reusable KPI metric card
│   └── ...
├── pages/
│   ├── dashboard.tsx         # Main dashboard page
│   └── not-found.tsx
├── App.tsx                   # Main app router
├── index.css                 # Global styles with brand colors
└── main.tsx
```

### Backend Structure
- **Framework**: Express.js
- **Database**: PostgreSQL (Replit built-in)
- **ORM**: Drizzle ORM
- **API**: RESTful routes

## Design System

### Design Guidelines
- File: `design_guidelines.md`
- Approach: Material Design System
- Color Mode: Light and Dark themes with Royal Blue primary color
- Typography: Inter font family with responsive sizing

### Component Library
- **KPI Cards**: Display key metrics with icons, values, and trends
- **Data Cards**: Additional metrics in secondary card style
- **Buttons**: Primary (Royal Blue), Secondary (Golden), Outline, Ghost variants
- **Tables**: Striped rows with Royal Blue headers
- **Icons**: All icons use Lucide React with Royal Blue primary color

## Current Features

### Completed (MVP)
1. **Dashboard Page**
   - Header with title and subtitle
   - 4 KPI metric cards (Revenue, Expenses, Net Profit, Health Status)
   - 3 secondary metric cards (Working Capital, Debt, Transparency)
   - Financial summary section
   - Responsive grid layout (1 col mobile, 2 col tablet, 4 col desktop)

2. **Design System**
   - Complete color system with Royal Blue primary and Golden secondary
   - Light and Dark mode support
   - All metrics displayed in Royal Blue
   - Accent elements in Golden Yellow
   - Hover states with elevation system

3. **UI/UX Standardization**
   - Consistent spacing and padding (p-6, gap-6)
   - Rounded corners (rounded-lg) for all cards
   - Hover elevation effects on all interactive elements
   - Data test IDs on all interactive elements and metrics

## User Preferences

- Language: Portuguese (Brazil)
- Design: Professional, modern, data-focused
- Brand-Centric: All UI must use HUA's Royal Blue and Golden Yellow
- Accessibility: High contrast, keyboard navigation, semantic HTML

## Installation & Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

Currently using Replit's built-in PostgreSQL database.

## Recent Changes

### 2025-12-19 - Brand Implementation
- Updated color system in `index.css` with HUA brand colors
- Created `design_guidelines.md` with complete brand specifications
- Updated dashboard to use Royal Blue for primary text and Golden for accents
- All KPI cards and metrics now follow HUA brand identity
- Created this documentation file (`replit.md`)

### Previous - MVP Dashboard Creation
- Built initial dashboard page with KPI cards
- Created reusable KPI card component
- Implemented responsive grid layouts
- Added trend indicators and metric displays

## Performance Notes

- Lightweight component library (Shadcn)
- Efficient CSS with Tailwind utility classes
- No external API calls in MVP (data is hardcoded)

## Next Steps (Future Features)

1. Add navigation sidebar with HUA branding
2. Implement actual database integration
3. Add chart/graph visualizations
4. Create additional pages (Reports, Analysis, Settings)
5. Implement user authentication
6. Add data export functionality
7. Create responsive mobile layout refinements

## Testing

All interactive elements have `data-testid` attributes following the pattern:
- `button-{action}`: For buttons
- `input-{name}`: For inputs
- `card-{section-name}`: For card containers
- `{type}-{content}-{id}`: For dynamic elements

## Deployment

Ready to deploy to Replit. Use the built-in publishing feature.

## Troubleshooting

### Colors not updating?
- Ensure you're modifying `client/src/index.css` with the correct HSL values
- Dark mode colors are set in the `.dark` CSS class
- Clear browser cache if changes don't appear

### Components not styled?
- Check that Tailwind CSS is properly compiled
- Verify imports in components (using @/ path aliases)
- Ensure card borders are using the correct border color utilities

## Useful Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
```

## Contact & Support

For questions about the HUA brand implementation or design system, refer to:
- Design Guidelines: `design_guidelines.md`
- Component Source: `client/src/components/`
- Colors Reference: `client/src/index.css` (CSS variables)

---

**Project Maintainer Notes**: All color changes must maintain the Royal Blue (#0066CC) as primary and Golden (#FFB800) as secondary to preserve brand consistency.
