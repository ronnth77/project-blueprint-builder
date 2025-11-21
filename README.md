# HabitForge - Build & Sustain Better Habits

A modern, gamified habit-tracking application that helps people build positive habits and break negative ones through intelligent scheduling, analytics, and a rewarding points system.

## 🎯 Problem Statement

Building and sustaining habits is hard. Most people fail because they lack:
- **Clear structure** for when and how to perform habits
- **Immediate feedback** on their progress
- **Motivation** to stay consistent over time
- **Insights** into what's working and what's not

HabitForge solves this by combining flexible scheduling, real-time analytics, gamification, and smart notifications into one cohesive experience.

## 🚀 User Journey

### 1. **Onboarding**
- Sign up / Login
- Welcome to personalized dashboard

### 2. **Create Your First Habit**
- Choose habit type: **Build** (positive) or **Break** (negative)
- Set name, description, category (Health, Work, Hobbies, Chores)
- Configure schedule:
  - **Daily**: Every day at a specific time
  - **Weekly**: Specific days of the week
  - **Monthly**: Specific dates each month
- Add reminders (up to 10 per habit)
- Set motivation and triggers

### 3. **Daily Engagement**
- View upcoming habits (next 3 hours)
- Receive in-app notifications at reminder times
- **Check-in** for build habits (one-click completion)
- **Confirm** for break habits (end-of-day: "Did you avoid it?")
- See immediate feedback: points earned, streaks updated, badges unlocked

### 4. **Track Progress**
- **Dashboard**: Total streaks, active habits, points, badges
- **Analytics Modal**: Longest streak, average streak, completion rate, calendar visualization
- **Habit Details**: Individual progress, notes, edit options

### 5. **Stay Motivated**
- Earn points that scale with account age (more points early on)
- Unlock badges at milestones: 10, 15, 30, 75, 150, 300 days
- Celebrate achievements with confetti animations
- Track cumulative points per habit

## 💰 Monetization & Retention Strategy

### Freemium Model
- **Free Tier**: 
  - Up to 5 active habits
  - Basic analytics
  - Standard reminders
  - Community badges

- **Premium Tier** ($4.99/month):
  - Unlimited habits
  - Advanced analytics (trends, predictions, export)
  - Custom reminder sounds/themes
  - Exclusive badge designs
  - Habit templates library
  - Priority support

### Retention Mechanisms
1. **Streak Protection**: Premium users get 1 "free pass" per month to maintain streaks
2. **Social Features** (Future): Share achievements, join challenges, accountability partners
3. **Habit Templates**: Pre-built habits from experts (premium)
4. **Weekly Reports**: Email summaries of progress (premium)

### Growth Strategy
- **Viral Loop**: "Share your streak" feature → friends sign up to compete
- **Content Marketing**: Blog posts on habit science, success stories
- **Referral Program**: Both users get 1 month premium when friend signs up

## 📊 Key Metric: Daily Active Users (DAU) with Check-ins

**Why this metric?**
- **Leading indicator** of habit formation success
- **Correlates with retention**: Users who check in 7+ days are 5x more likely to stay
- **Actionable**: We can optimize notification timing, UI, and gamification to increase DAU

**How we'd track it:**
- Daily check-in rate: `(users who checked in today) / (total active users)`
- Target: 60%+ daily check-in rate
- Segment by: habit type, account age, premium status

**Optimization levers:**
- A/B test notification copy and timing
- Improve "upcoming habits" visibility
- Add streak recovery features
- Gamify daily login (daily bonus points)

## 🎨 Core Features

### Habit Management
- ✅ Create, edit, delete habits
- ✅ Support for build (positive) and break (negative) habits
- ✅ Flexible scheduling: daily, weekly, monthly
- ✅ Multiple reminders per habit (up to 10)
- ✅ Categories: Health, Work, Hobbies, Chores

### Gamification
- ✅ Points system (scales with account age)
- ✅ Badge system (6 milestone badges)
- ✅ Streak tracking (per habit + overall)
- ✅ Celebration animations

### Analytics
- ✅ Longest streak calculation
- ✅ Average streak across all periods
- ✅ Completion rate (completed / scheduled days)
- ✅ Calendar visualization (completed vs missed days)

### Notifications & Reminders
- ✅ In-app notifications at reminder times
- ✅ Smart scheduling (respects daily/weekly/monthly)
- ✅ End-of-day confirmation for break habits

### User Experience
- ✅ Modern, responsive UI
- ✅ Help system with contextual guidance
- ✅ Notes per habit
- ✅ Upcoming habits view (next 3 hours)

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **UI Framework**: shadcn/ui + Tailwind CSS
- **Routing**: React Router v6
- **State Management**: React Context + TanStack Query
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Charts**: Recharts

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation
ash
# Clone the repository
git clone <YOUR_GIT_URL>
cd project-blueprint-builder

# Install dependencies
npm install

# Start development server
npm run dev### Build for Production

npm run build
npm run preview## 📱 Live Demo

[Add your deployed URL here - from Lovable Share -> Publish]

## 🎯 Future Enhancements

- [ ] Social features (challenges, sharing)
- [ ] Mobile app (React Native)
- [ ] Habit templates marketplace
- [ ] AI-powered habit suggestions
- [ ] Integration with health apps (Apple Health, Google Fit)
- [ ] Export analytics data
- [ ] Dark mode toggle

## 📄 License

[Add your license]

---

**Built for**: Product Design Challenge - "Build for Habit"  
**Focus**: Clarity over polish, demonstrating product sense, UX, and growth thinking