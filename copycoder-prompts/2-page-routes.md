Set up the page structure according to the following prompt:
   
<page-structure-prompt>
Next.js route structure based on navigation menu items (excluding main route). Make sure to wrap all routes with the component:

Routes:
- /dashboard
- /billing
- /reports
- /settings
- /services
- /inspections
- /Contracts
- /Limitations
- /E-mails
- /contacts

Page Implementations:
/dashboard:
Core Purpose: Provide overview of key business metrics and recent activities
Key Components
- Stats cards (appointments, revenue, clients)
- Recent appointments widget
- Activity timeline
- Quick action buttons
- Performance charts
Layout Structure
- Grid layout with responsive cards
- Main content area with 2-3 columns
- Sidebar with notifications

/billing:
Core Purpose: Provide an overview and management of financial transactions, including service payments, statuses, and billing details.
Key Components:
- Billing Overview: Summary of total revenue, pending payments, and completed transactions.
- Invoice List: Table displaying all transactions with filters (Paid, Pending, Overdue).
- Payment Status Indicators: Visual markers for payment status (e.g., Paid, Pending, Failed).
- Transaction Details: Expandable view with invoice breakdown, payment method, and client details.
- Payment Processing: Quick access to process payments or resend invoices.
- Subscription Management: Display of current plan, renewal dates, and upgrade options.
- Export & Reports: Download invoices, generate financial reports.
Layout Structure:
- Main Content Area (2-3 columns):
- Header ContenteÇ Title and Description
- Above Header content: Filters & Summary Cards (Revenue, Pending, Overdue).
- Grid Layout: Responsive design with collapsible sections for mobile usability.

/reports:
Core Purpose: Provide a historical overview and status tracking of all inspection services, focusing on scheduled, in-progress, completed, and canceled reports.

Key Components:
Reports Overview: Summary of total inspections categorized by status.
Reports List: Table displaying all inspection reports with filters:
Scheduled – Upcoming inspections.
In Progress – Ongoing inspections.
Completed – Finalized reports ready for delivery.
Canceled – Inspections that were canceled.
Status Indicators: Clear visual markers for each report’s current status.
Report Details: Expandable view with:
Client information
Property details (address, type, size)
Assigned inspector
Report type
Inspection date and time
Action Buttons: Options to:
View full report
Edit details (if applicable)
Download report (PDF or other formats)
Resend report to the client
Search & Filters:
Date range selection
Inspector filter
Property type filter
Status-based sorting
Export & Reports Analytics: Options to export data in various formats (CSV, PDF).
Layout Structure:
Header: Page title and quick summary of inspections.
Grid Layout with Dynamic Cards:
Top Section: Summary cards displaying counts of scheduled, in-progress, completed, and canceled reports.
Middle Section: Reports List in a table format with sorting and filtering options.
Bottom Section: Detailed view for selected reports with all relevant data and actions.

/settings
Core Purpose: Provide inspectors with full control over their profile, business settings, subscription plan, payment details, security, and integrations.
Key Components:
Profile Settings:
Name, email, phone number
Profile picture upload
Business details (company name, logo, address, branding colors)
Subscription & Upgrade:
Current plan (Free/Pro) with benefits comparison
Upgrade/downgrade options
Subscription status & renewal date
Billing history & invoices
Payment Settings:
Linked payment methods (Stripe)
Default payment preferences
Transaction history
Security & Password Management:
Change password
Email & SMS notifications
Report and payment reminders
Layout Structure:
Header: Page title with a summary of key settings.
Grid Layout with Sections:
Left Column: Profile & Business Information
Center Column: Subscription & Payment Details
Right Column: Security, Integrations, and Notifications
Save Changes & Update Buttons for real-time settings modification.

/inspections
Core Purpose: Manage all property inspections, including scheduling, editing, viewing details, and tracking their status.
Key Components: Inspections Overview:
Summary of total inspections categorized by status:
Scheduled – Upcoming inspections
In Progress – Ongoing inspections
Completed – Finalized inspections
Canceled – Inspections that were canceled
Inspection List:
Table with filters for status, date, property type, and assigned inspector
Search bar for quick access to specific inspections
Sort by date, status, or client
Inspection Details:
Property information (address, type, size)
Client details (name, contact)
Assigned inspector
Scheduled date & time
Notes and additional comments
Attachments (photos, documents)
Action Buttons:
View full inspection details
Edit inspection details (reschedule, update notes, change assigned inspector)
Cancel inspection (with reason)
Mark as Completed once the inspection is finished
Layout Structure:
Header: Page title with quick summary of inspection stats
Grid Layout with Sections:
Top Section: Summary cards for Scheduled, In Progress, Completed, and Canceled inspections
Middle Section: Inspection List with filtering and sorting options
Bottom Section: Detailed view for selected inspections with edit and action options

/contracts
Core Purpose: Allow inspectors to create, edit, and manage contract templates for inspections, ensuring standardized agreements with clients.
Key Components: Contracts Overview:
Summary of total contracts categorized by:
Active Contracts – Currently in use
Drafts – Unfinished templates
Archived – Old or unused contracts
Contract List:
Table displaying all contracts with filters for status, creation date, and type
Search bar for quick access to specific contracts
Sorting options by date, name, or status
Contract Details & Editor:
Contract title and description
Editable content area (rich text editor)
Dynamic fields for automatic data insertion (client name, inspection date, property address, etc.)
Signature fields (optional)
Action Buttons:
Create New Template – Start a new contract from scratch
Edit Contract – Modify existing templates
Duplicate Contract – Create a copy for variations
Delete/Archive Contract – Remove or deactivate old templates
Preview Contract – View how the contract will appear to clients
Export & Sharing Options:
Download contract as PDF
Share contract via email or link
Layout Structure:
Header: Page title with quick access to "Create New Contract"
Grid Layout with Sections:
Top Section: Summary cards for contract status (Active, Drafts, Archived)
Middle Section: Contract List with filtering and sorting options
Bottom Section: Contract editor for selected contracts, with save and preview options

/emails
Core Purpose: Manage email templates for communication with clients, including creating, editing, deleting, and organizing pre-defined messages for different scenarios.
Key Components: Email Templates Overview:
Summary of total templates categorized by:
Active Templates – Currently in use
Drafts – Unfinished email drafts
Archived – Old or unused templates
Email Template List:
Table displaying all templates with filters for category, status, and creation date
Search bar for quick access to specific templates
Sorting options by date, name, or usage frequency
Email Template Editor:
Email subject line and description
Rich text editor for content customization (bold, italics, lists, links, images)
Dynamic placeholders (e.g., {{client_name}}, {{inspection_date}}, {{property_address}})
Preview mode to see how the email will appear to recipients
Action Buttons:
Create New Template – Start a new email template from scratch
Edit Template – Modify existing templates
Duplicate Template – Create a copy for variations
Delete/Archive Template – Remove or deactivate old templates
Send Test Email – Preview how the email looks in an inbox
Export & Integration Options:
Export template as a file or copy HTML code
Connect with automation (e.g., trigger-based emails for inspections, payments, reminders)
Layout Structure:
Header: Page title with a "Create New Email" button
Grid Layout with Sections:
Top Section: Summary cards for email template status (Active, Drafts, Archived)
Middle Section: Email Template List with filtering and sorting options
Bottom Section: Email editor for selected templates, with save, preview, and test email options

/contacts
Core Purpose: Manage contacts and registered properties, allowing users to create, view, update, and delete client and property records.
Key Components: Contacts & Properties Overview:
Summary of total contacts and properties categorized by:
Clients – List of property owners or inspection requesters
Properties – Registered properties linked to contacts
Recent Activity – Recently added or updated contacts and properties
Contacts List:
Table displaying all contacts with filters for name, email, phone, and registration date
Search bar for quick access to specific contacts
Sorting options by name, last interaction, or number of inspections
Properties List:
Table displaying all registered properties with filters for address, type (house, apartment, commercial), and associated client
Search and sorting options by property type, size, or location
Contact & Property Details:
Contact Details:
Name, email, phone number
Associated properties
Inspection history
Notes & tags
Property Details:
Address, type, size
Linked client (owner)
Previous inspections
Notes & important details
Action Buttons:
Create New Contact – Add a new client
Create New Property – Register a new property
Edit Contact/Property – Modify existing details
Delete Contact/Property – Remove from database
Assign Inspection – Directly schedule an inspection for a contact/property
Export & Import Options:
Export contacts/properties as CSV or PDF
Import contacts from an external file
Layout Structure:
Header: Page title with quick access to "Add New Contact" or "Add New Property"
Grid Layout with Sections:
Top Section: Summary cards for total contacts, properties, and recent activity
Middle Section: Contacts & Properties List with filtering and sorting options
Bottom Section: Detailed view for selected contact or property with action buttons

Layouts:
DashboardLayout:
Applicable routes
- All routes
Core components
- Navigation sidebar
- Top header bar
- User profile menu
- Search bar
- Breadcrumbs
Responsive behavior
- Collapsible sidebar on mobile
- Sticky header
- Responsive navigation menu
- Adaptive content area

ContentLayout
Applicable routes
- /dashboard
- /billing
- /reports
- /settings
- /inspections
- /contracts
- /emails
- /contacts

Core components
- Page header
- Action toolbar
- Content container
- Footer actions
Responsive behavior
- Fluid container width
- Stack layout on mobile
- Floating action buttons
- Responsive data tables
</page-structure-prompt>