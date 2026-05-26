# MedSpaces Platform

India's largest marketplace for consultation spaces — connecting doctors with available practice spaces at clinics, hospitals, and diagnostic centers.

## Features

- **Public Website** - Home, Browse Spaces, For Doctors, For Clinics, About, Contact, FAQ
- **Clinic Listing Marketplace** - Browse, filter by city/specialty/price/facility type
- **Listing Detail Pages** - Room details, pricing, availability, infrastructure, CTAs
- **Doctor Registration** - Professional profile with qualifications and preferences
- **Clinic Registration** - List consultation spaces with details and pricing
- **Inquiry System** - Contact clinics via call, WhatsApp, or inquiry form
- **Admin Dashboard** - Manage listings, doctors, inquiries, verification

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Deployment:** Vercel-ready

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── browse/               # Listing marketplace with filters
│   ├── listing/[id]/         # Listing detail page
│   ├── for-doctors/          # For Doctors info page
│   ├── for-clinics/          # For Clinics info page
│   ├── register/doctor/      # Doctor registration form
│   ├── add-space/            # Clinic listing submission
│   ├── inquiry/              # Inquiry form
│   ├── admin/                # Admin dashboard
│   ├── about/                # About page
│   ├── contact/              # Contact page
│   ├── faq/                  # FAQ page
│   ├── branding/             # Branding services
│   ├── privacy/              # Privacy policy
│   └── terms/                # Terms of service
├── components/
│   ├── Header.tsx            # Navigation header
│   ├── Footer.tsx            # Site footer
│   └── ListingCard.tsx       # Listing card component
└── data/
    └── listings.ts           # Sample data and types
```

## Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Landing page with hero, stats, featured listings |
| Browse Spaces | `/browse` | Marketplace with search & filters |
| Listing Detail | `/listing/[id]` | Full listing information |
| For Doctors | `/for-doctors` | Doctor-facing info page |
| For Clinics | `/for-clinics` | Clinic-facing info page |
| Register Doctor | `/register/doctor` | Doctor registration form |
| Add Space | `/add-space` | Clinic listing form |
| Inquiry | `/inquiry` | Inquiry/introduction request |
| Admin | `/admin` | Admin dashboard (password: admin123) |
| About | `/about` | About MedSpaces |
| Contact | `/contact` | Contact form |
| FAQ | `/faq` | Frequently asked questions |
| Branding | `/branding` | Growth & branding services |

## License

Private - All rights reserved.
