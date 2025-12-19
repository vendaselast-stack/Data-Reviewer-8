# Financial Dashboard Design Guidelines

## Design Approach: Material Design System
Selected for its excellent treatment of data-dense interfaces, card-based layouts, and professional aesthetic suitable for financial applications. Emphasizes clear hierarchy, readable typography, and structured information architecture.

## Typography System

**Font Family**: Inter (primary), Roboto Mono (monospaced numbers)
- Dashboard Title/Headers: 2xl-3xl, semibold (600)
- Section Headers: xl, semibold (600)
- Card Titles: base, medium (500)
- Metric Values: 3xl-4xl, bold (700) with tabular numbers
- Metric Labels: sm, regular (400), uppercase tracking-wide
- Body/Descriptions: sm, regular (400)
- Percentage Changes: sm, medium (500)

## Layout System

**Spacing Primitives**: Tailwind units of 3, 4, 6, 8 for consistency
- Card padding: p-6
- Section gaps: gap-6
- Page margins: px-8, py-6
- Component spacing: space-y-4

**Grid Structure**:
- Main container: max-w-screen-2xl mx-auto
- KPI card grid: 4 columns on desktop (grid-cols-1 md:grid-cols-2 lg:grid-cols-4)
- Chart section: 2 columns for larger widgets (grid-cols-1 lg:grid-cols-2)
- Data tables: Full-width within sections

## Component Library

### Header/Navigation
- Top bar with logo, breadcrumbs, user profile, and notifications
- Height: h-16
- Sticky positioning for scrolling contexts
- Search input (w-72) with icon prefix
- Avatar with dropdown menu

### KPI Metric Cards (Primary Components)
Structure per card:
- Rounded corners (rounded-lg)
- Subtle elevation (shadow-sm with border)
- Icon container: w-12 h-12, rounded-lg with icon from Heroicons (outline style)
- Metric value: Large, bold typography with monospaced numbers
- Metric label: Above or below value, uppercase, small tracking
- Trend indicator: Arrow icon + percentage with appropriate visual treatment
- Comparison text: "vs last month" in muted text

Layout: Equal height cards with flex column, space-between for alignment

### Chart/Graph Containers
- Larger cards (rounded-lg) with p-6 padding
- Header with title + time period selector (dropdown)
- Chart area with proper aspect ratio (aspect-w-16 aspect-h-9 or similar)
- Use placeholder comments for charts: `<!-- CHART: Line graph showing revenue trends -->`

### Data Tables
- Striped rows for scanability
- Fixed header row (sticky top-0)
- Monospaced numbers in numeric columns (right-aligned)
- Action column with icon buttons (right-aligned)
- Compact row height (h-12) for data density

### Sidebar (Optional Dashboard Context)
- Left sidebar (w-64) with navigation links
- Icon + label pattern
- Active state indication with border accent
- Collapsible on mobile

## Dashboard Layout Structure

**Primary Layout** (no hero image - dashboard app):
1. Top Navigation Bar (sticky)
2. Page Header Section (flex justify-between):
   - Title + subtitle/date range
   - Action buttons (Export, Filter, Date picker)
3. KPI Overview Grid (4 columns):
   - Revenue, Profit, Expenses, Growth Rate cards
4. Main Content Area (2-column grid):
   - Revenue Chart (col-span-2 or full width)
   - Expense Breakdown (pie/donut chart)
   - Recent Transactions Table
   - Performance Metrics Grid
5. Bottom Section:
   - Full-width table or additional analytics

## Icons
**Library**: Heroicons (outline style) via CDN
- Metrics: TrendingUpIcon, BanknotesIcon, ChartBarIcon, ArrowTrendingUpIcon
- Navigation: HomeIcon, ChartPieIcon, DocumentTextIcon, Cog6ToothIcon
- Actions: FunnelIcon, ArrowDownTrayIcon, CalendarIcon
- Status: CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon

## Interaction Patterns

**Card Hover States**: Subtle lift (translate-y-[-2px]) with enhanced shadow
**Buttons**: Standard rounded (rounded-md), px-4 py-2, medium weight text
**Dropdowns**: Positioned absolute menus with shadow-lg, rounded-lg
**Loading States**: Skeleton screens matching card structure
**Empty States**: Centered icon + message in card containers

## Spacing & Rhythm

- Page container: py-6 px-8
- Section spacing: space-y-8 between major sections
- Card grids: gap-6
- Within cards: space-y-4 for stacked elements
- Form elements: space-y-3

## Accessibility
- All interactive elements minimum 44px touch target
- Proper heading hierarchy (h1 → h2 → h3)
- ARIA labels for icon-only buttons
- Sufficient contrast ratios for all text (will be handled by color system)
- Focus indicators on all interactive elements (ring-2 ring-offset-2)

## Images
**No hero image** - This is an application dashboard, not a marketing page. Focus entirely on data visualization and functional UI components.