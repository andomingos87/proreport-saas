Initialize Next.js in current directory:
```bash
mkdir temp; cd temp; npx create-next-app@latest . -y --typescript --tailwind --eslint --app --use-npm --src-dir --import-alias "@/*" -no --turbo
```

Now let's move back to the parent directory and move all files except prompt.md.

For Windows (PowerShell):
```powershell
cd ..; Move-Item -Path "temp*" -Destination . -Force; Remove-Item -Path "temp" -Recurse -Force
```

For Mac/Linux (bash):
```bash
cd .. && mv temp/* temp/.* . 2>/dev/null || true && rm -rf temp
```

Set up the frontend according to the following prompt:
<frontend-prompt>
Create detailed components with these requirements:
1. Use 'use client' directive for client-side components
2. Make sure to concatenate strings correctly using backslash
3. Style with Tailwind CSS utility classes for responsive design
4. Use Lucide React for icons (from lucide-react package). Do NOT use other UI libraries unless requested
5. Use stock photos from picsum.photos where appropriate, only valid URLs you know exist
6. Configure next.config.js image remotePatterns to enable stock photos from picsum.photos
7. Create root layout.tsx page that wraps necessary navigation items to all pages
8. MUST implement the navigation elements items in their rightful place i.e. Left sidebar, Top header
9. Accurately implement necessary grid layouts
10. Follow proper import practices:
   - Use @/ path aliases
   - Keep component imports organized
   - Update current src/app/page.tsx with new comprehensive code
   - Don't forget root route (page.tsx) handling
   - You MUST complete the entire prompt before stopping

<summary_title>
Property Inspection Report & Lead Generation Platform with Task and Calendar Integration
</summary_title>

<image_analysis>

1. Navigation Elements:
- Left sidebar with: Dashboard, Billing, Reports, Settings, Services, Contacts
- Sidebar Footer with: "Upgrade to Pro" button
- Top right: Notifications icon, "+ New Booking" button, User profile


2. Layout Components:
- Main container: Full width with padding
- Card containers: ~300px width, consistent padding
- Sidebar width: ~240px
- Header height: ~64px


3. Content Sections:
- Overview metrics cards (4 sections)
- Tasks section with tabs (Upcoming/In Progress)
- Calendar widget with month/week/day views
- Dashboard header with description text


4. Interactive Controls:
- Task checkboxes with status indicators
- Calendar date selection
- Task action menu (3-dot menu)
- Tab switches for task categories
- Calendar view toggles (Mês, Semana, Dia)


5. Colors:
- Primary: #6C5DD3 (purple accent)
- Secondary: #F9F9F9 (background)
- Text: #333333 (dark gray)
- Accent: #FFB800 (yellow button)
- Status: #22C55E (green success)


6. Grid/Layout Structure:
- 12-column grid system
- 24px gap between cards
- Responsive breakpoints at 768px, 1024px, 1440px
- Flexible card layouts for different screen sizes
</image_analysis>

<development_planning>

1. Project Structure:
```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar
│   │   ├── Header
│   │   └── MetricsCards
│   ├── features/
│   │   ├── Tasks
│   │   ├── Calendar
│   │   └── Statistics
│   └── shared/
```


2. Key Features:
- Real-time metrics dashboard
- Task management system
- Calendar integration
- Property and client management
- Revenue tracking


3. State Management:
```typescript
interface AppState {
├── dashboard: {
│   ├── metrics: MetricsData
│   ├── tasks: TaskItem[]
│   ├── calendar: CalendarEvents[]
├── }
├── properties: {
│   ├── residential: Property[]
│   └── commercial: Property[]
├── }
└── user: UserProfile
}
```


4. Routes:
```typescript
const routes = [
├── '/dashboard',
├── '/appointments/*',
├── '/clients/*',
├── '/properties/*',
└── '/reports/*'
]
```


5. Component Architecture:
- DashboardLayout (parent)
- MetricsGrid (displays statistics)
- TaskManager (handles task CRUD)
- CalendarWidget (date management)
- PropertyList (property display)


6. Responsive Breakpoints:
```scss
$breakpoints: (
├── 'mobile': 320px,
├── 'tablet': 768px,
├── 'desktop': 1024px,
└── 'wide': 1440px
);
```
</development_planning>
</frontend-prompt>

IMPORTANT: Please ensure that (1) all KEY COMPONENTS and (2) the LAYOUT STRUCTURE are fully implemented as specified in the requirements. Ensure that the color hex code specified in image_analysis are fully implemented as specified in the requirements.