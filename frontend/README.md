# CBU SDA Public Campus Ministries Website

Official repository for the Copperbelt University Seventh-day Adventist Public Campus Ministries website.

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwind-css)

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Development Workflow](#-development-workflow)
- [Git Workflow](#-git-workflow)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🛠️ Tech Stack

### Frontend Framework
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router, Server Components, and Server Actions
- **[React 18](https://react.dev/)** - UI library with hooks and concurrent features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript for better DX and fewer bugs

### Styling & UI
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework for rapid UI development
- **[shadcn/ui](https://ui.shadcn.com/)** - High-quality, accessible React components built on Radix UI
- **[Lucide React](https://lucide.dev/)** - Beautiful, consistent icon library

### Backend & Database
- **[Supabase](https://supabase.com/)** - Open-source Firebase alternative
  - **PostgreSQL Database** - Powerful relational database
  - **Authentication** - Built-in auth with email, OAuth, magic links
  - **Storage** - File storage for images, documents, media
  - **Real-time** - WebSocket subscriptions for live updates
  - **Row Level Security (RLS)** - Database-level security policies
  - **Edge Functions** - Serverless functions at the edge

### API & Data Fetching
- **Next.js API Routes** - RESTful API endpoints
- **Server Actions** - Type-safe server mutations
- **React Query / SWR** - Data fetching, caching, and synchronization (recommended addition)

### Forms & Validation
- **[React Hook Form](https://react-hook-form.com/)** - Performant form library
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation

### Analytics & Monitoring
- **[Vercel Analytics](https://vercel.com/analytics)** - Web analytics and performance insights
- **[Sentry](https://sentry.io/)** - Error tracking and performance monitoring (recommended)
- **[PostHog](https://posthog.com/)** - Product analytics and feature flags (optional)

### Email Services
- **[Resend](https://resend.com/)** - Modern email API for transactional emails (recommended)
- **[React Email](https://react.email/)** - Build emails with React components
- **Alternative**: SendGrid, Mailgun, or AWS SES

### Payment Processing (Optional)
- **[Stripe](https://stripe.com/)** - Payment processing for donations and event tickets
- **Alternative**: PayPal, Flutterwave (for African markets)

### Testing
- **[Jest](https://jestjs.io/)** - JavaScript testing framework
- **[React Testing Library](https://testing-library.com/react)** - React component testing
- **[Playwright](https://playwright.dev/)** - End-to-end testing
- **[MSW](https://mswjs.io/)** - API mocking for tests

### DevOps & Deployment
- **[Vercel](https://vercel.com/)** - Deployment platform optimized for Next.js
- **[GitHub Actions](https://github.com/features/actions)** - CI/CD pipelines
- **[Docker](https://www.docker.com/)** - Containerization (optional)

### Code Quality
- **[ESLint](https://eslint.org/)** - JavaScript/TypeScript linting
- **[Prettier](https://prettier.io/)** - Code formatting
- **[Husky](https://typicode.github.io/husky/)** - Git hooks for pre-commit checks
- **[lint-staged](https://github.com/okonet/lint-staged)** - Run linters on staged files

---

## ✨ Features

### Public Features
- ✅ **Homepage** - Hero section, features, testimonials, newsletter signup
- ✅ **Impact CBU 2026** - Event landing page with countdown timer and registration
- 🚧 **Events** - Browse, filter, and register for campus events
- 🚧 **News & Articles** - Latest ministry updates and blog posts
- 🚧 **Gallery** - Photo galleries from events and activities
- 🚧 **Committees** - Information about ministry committees and teams
- 🚧 **Programs** - Details about ongoing programs and initiatives
- 🚧 **Resources** - Downloadable Bible studies, sermons, and materials
- 🚧 **Counseling** - Book appointments with campus counselors
- 🚧 **Prayer Requests** - Submit and view prayer requests
- 🚧 **Support/Donate** - Online giving and donation tracking

### Admin Features
- 🚧 **Dashboard** - Analytics, statistics, and key metrics
- 🚧 **User Management** - Manage members, roles, and permissions
- 🚧 **Content Management** - Create and edit news, events, resources
- 🚧 **Event Management** - CRUD operations for events and registrations
- 🚧 **Gallery Management** - Upload and organize photos
- 🚧 **Prayer Request Moderation** - Review and manage prayer requests
- 🚧 **Newsletter Management** - Send emails to subscribers
- 🚧 **Analytics Dashboard** - Visitor stats, engagement metrics

### Technical Features
- ✅ **Responsive Design** - Mobile-first, works on all devices
- ✅ **Dark Mode Support** - Theme switching capability
- ✅ **SEO Optimized** - Meta tags, sitemap, structured data
- ✅ **Performance** - Image optimization, lazy loading, code splitting
- ✅ **Accessibility** - WCAG 2.1 AA compliant
- 🚧 **Authentication** - Secure login with role-based access
- 🚧 **Real-time Updates** - Live notifications and data sync
- 🚧 **Search** - Full-text search across content
- 🚧 **Internationalization** - Multi-language support (future)

**Legend**: ✅ Complete | 🚧 In Progress | 📋 Planned

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** - v18.17.0 or higher ([Download](https://nodejs.org/))
- **npm** - v9.0.0 or higher (comes with Node.js)
  - Or **pnpm** - v8.0.0 or higher ([Install](https://pnpm.io/installation))
- **Git** - v2.30 or higher ([Download](https://git-scm.com/))
- **Code Editor** - VS Code recommended ([Download](https://code.visualcode.com/))

### Recommended VS Code Extensions
- ESLint
- Prettier - Code formatter
- Tailwind CSS IntelliSense
- GitLens
- Error Lens
- Auto Rename Tag

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
# Using HTTPS
git clone https://github.com/your-org/pcm-website.git

# Or using SSH (recommended)
git clone git@github.com:your-org/pcm-website.git

# Navigate to project directory
cd pcm-website
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Or using pnpm (faster)
pnpm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Email Configuration (Optional - for production)
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=noreply@cbu-sda.org

# Payment Configuration (Optional)
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_google_analytics_id
SENTRY_DSN=your_sentry_dsn
```

### 4. Database Setup

#### Option A: Use Existing Supabase Project
1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Create a new project or use existing one
3. Copy the project URL and anon key to `.env.local`
4. Run database migrations:

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

#### Option B: Local Supabase (Development)
```bash
# Start local Supabase
supabase start

# This will output local credentials - add them to .env.local
```

### 5. Run the Development Server

```bash
# Using npm
npm run dev

# Or using pnpm
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Verify Installation

You should see:
- ✅ Homepage loads without errors
- ✅ Navigation works
- ✅ No console errors
- ✅ Tailwind styles applied

---

## 📁 Project Structure

```
pcm-website/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth routes group
│   │   ├── login/
│   │   └── register/
│   ├── admin/                    # Admin dashboard
│   │   ├── content/
│   │   ├── events/
│   │   └── layout.tsx
│   ├── committees/
│   ├── counseling/
│   ├── events/
│   ├── gallery/
│   ├── impact/                   # Impact CBU 2026 page
│   ├── magazines/
│   ├── news/
│   ├── prayer-request/
│   ├── programs/
│   ├── resources/
│   ├── support/
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   └── globals.css               # Global styles
│
├── components/                   # React components
│   ├── auth/                     # Authentication components
│   ├── ui/                       # shadcn/ui components
│   └── theme-provider.tsx
│
├── lib/                          # Utility functions
│   ├── auth.ts                   # Auth helpers
│   ├── database.ts               # Database helpers
│   ├── supabase.ts               # Supabase client
│   └── utils.ts                  # General utilities
│
├── hooks/                        # Custom React hooks
│   ├── use-mobile.ts
│   └── use-toast.ts
│
├── public/                       # Static assets
│   ├── Features/
│   ├── Slider/
│   └── *.png
│
├── supabase/                     # Database schema & migrations
│   ├── schema.sql
│   └── seed.sql
│
├── .env.local                    # Environment variables (create this)
├── .env.example                  # Environment template
├── .gitignore
├── components.json               # shadcn/ui config
├── next.config.mjs               # Next.js config
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts            # Tailwind config
├── tsconfig.json                 # TypeScript config
└── README.md
```

---

## 💻 Development Workflow

### Available Scripts

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors

# Testing (when configured)
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run E2E tests

# Database
npm run db:push      # Push schema changes to database
npm run db:pull      # Pull schema from database
npm run db:reset     # Reset database (caution!)
npm run db:seed      # Seed database with sample data

# Code Quality
npm run format       # Format code with Prettier
npm run type-check   # Check TypeScript types
```

### Development Tips

1. **Hot Reload**: Changes auto-reload in the browser
2. **TypeScript**: Check types with `npm run type-check`
3. **Linting**: Fix issues with `npm run lint:fix`
4. **Console**: Check browser console for errors
5. **Network**: Use browser DevTools to debug API calls

---

## 🔄 Git Workflow

### Branch Strategy

```
main (production)
├── develop (integration)
    ├── feature/your-feature
    ├── bugfix/your-bugfix
    └── hotfix/critical-fix
```

### Starting a New Feature

```bash
# 1. Switch to develop branch
git checkout develop

# 2. Pull latest changes
git pull origin develop

# 3. Create feature branch
git checkout -b feature/event-registration

# 4. Make your changes
# ... edit files ...

# 5. Stage specific files (NEVER use git add .)
git add app/events/page.tsx
git add components/EventForm.tsx

# 6. Commit with descriptive message
git commit -m "feat(events): add event registration form"

# 7. Push to remote
git push origin feature/event-registration

# 8. Create Pull Request on GitHub
# Base: develop
# Compare: feature/event-registration
```

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat(scope): add new feature
fix(scope): fix a bug
docs: update documentation
style: format code (no logic change)
refactor: refactor code
test: add tests
chore: maintenance tasks

# Examples:
git commit -m "feat(auth): implement login functionality"
git commit -m "fix(events): resolve date formatting issue"
git commit -m "docs: update README with setup instructions"
git commit -m "style(admin): format dashboard components"
git commit -m "refactor(api): optimize database queries"
git commit -m "test(events): add unit tests for event service"
git commit -m "chore: upgrade dependencies"
```

### Pull Request Process

1. **Create PR** on GitHub
2. **Fill PR template** with description, changes, testing
3. **Request review** from team lead
4. **Address feedback** and make changes
5. **Wait for approval** (at least 1 approval required)
6. **Merge** using "Squash and Merge"
7. **Delete branch** after merging

### Keeping Your Branch Updated

```bash
# Fetch latest changes
git fetch origin

# Rebase on develop (preferred)
git rebase origin/develop

# Or merge develop into your branch
git merge origin/develop

# Resolve conflicts if any
# Then push
git push origin feature/your-feature --force-with-lease
```

### Git Best Practices

#### ✅ DO:
- Pull before starting work
- Create feature branches from `develop`
- Write clear commit messages
- Stage specific files
- Test before pushing
- Keep commits small and focused
- Delete branches after merging

#### ❌ DON'T:
- Never push to `main` directly
- Never use `git add .` (stage specific files)
- Never commit `.env.local` or secrets
- Never force push to shared branches
- Never commit commented code
- Never commit `console.log` statements

---

## 🚀 Deployment

### Vercel Deployment (Recommended)

#### 1. Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: .next

#### 2. Environment Variables

Add all variables from `.env.local` in Vercel:
- Go to Project Settings → Environment Variables
- Add each variable for Production, Preview, and Development

#### 3. Deploy

```bash
# Automatic deployment
git push origin main  # Deploys to production
git push origin develop  # Deploys to preview

# Manual deployment (using Vercel CLI)
npm install -g vercel
vercel login
vercel --prod  # Deploy to production
```

### Custom Server Deployment

```bash
# Build the application
npm run build

# Start production server
npm run start

# Or use PM2 for process management
npm install -g pm2
pm2 start npm --name "pcm-website" -- start
```

### Docker Deployment

```dockerfile
# Dockerfile (create this)
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

```bash
# Build and run
docker build -t pcm-website .
docker run -p 3000:3000 pcm-website
```

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### 1. Fork the Repository

```bash
# Fork on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/pcm-website.git
cd pcm-website
git remote add upstream https://github.com/original-org/pcm-website.git
```

### 2. Create a Feature Branch

```bash
git checkout -b feature/amazing-feature
```

### 3. Make Your Changes

- Follow the code style (ESLint + Prettier)
- Write meaningful commit messages
- Add tests if applicable
- Update documentation

### 4. Test Your Changes

```bash
npm run lint
npm run type-check
npm run build
npm run test  # if tests are configured
```

### 5. Submit a Pull Request

- Push to your fork
- Create PR to `develop` branch
- Fill out the PR template
- Wait for review

### Code Style Guidelines

- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Keep components small and focused
- Use Tailwind CSS for styling
- Add comments for complex logic
- Write self-documenting code

---

## 📚 Additional Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)

### Learning Resources
- [Next.js Learn Course](https://nextjs.org/learn)
- [React Tutorial](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Supabase Tutorials](https://supabase.com/docs/guides/getting-started)

### Community
- [Next.js Discord](https://nextjs.org/discord)
- [Supabase Discord](https://discord.supabase.com/)
- [React Community](https://react.dev/community)

---

## 🐛 Troubleshooting

### Common Issues

#### Port 3000 already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

#### Module not found errors
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

#### Supabase connection errors
- Check `.env.local` has correct credentials
- Verify Supabase project is running
- Check network connection

#### Build errors
```bash
# Check TypeScript errors
npm run type-check

# Check for ESLint errors
npm run lint
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Tech Lead**: [Name]
- **Backend Developer**: [Name]
- **Frontend Developer**: [Name]
- **Admin Dashboard**: [Name]
- **QA/Testing**: [Name]

---

## 📞 Contact

For questions or support:
- **Email**: tech@cbu-sda.org
- **Website**: https://cbu-sda.org
- **GitHub Issues**: [Create an issue](https://github.com/your-org/pcm-website/issues)

---

## 🙏 Acknowledgments

- CBU SDA Public Campus Ministries
- All contributors and supporters
- Open source community

---

**Built with ❤️ by the CBU SDA Tech Team**

*Last Updated: January 2025*
