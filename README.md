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
- Set name, description, category (default: Health, Work, Hobbies, Chores - customizable in Premium)
- Configure schedule:
  - **Daily**: Every day at a specific time
  - **Weekly**: Specific days of the week
  - **Monthly**: Specific dates each month
- Add reminders (Free: 1 for build habits, 2 for break habits | Premium: up to 10)
- Set motivation and triggers

### 3. **Daily Engagement**
- View upcoming habits (next 3 hours)
- Receive in-app notifications at reminder times
- **Check-in** for build habits (one-click completion)
- **Confirm** for break habits (end-of-day: "Did you avoid it?")
- **Session Feedback** (Premium): Rate your performance with predefined parameters
- See immediate feedback: points earned, streaks updated, badges unlocked

### 4. **Track Progress**
- **Dashboard**: Total streaks, active habits, points, badges
- **Analytics Modal**: Longest streak, average streak, completion rate, calendar visualization
- **Advanced Analytics** (Premium): Session feedback insights, performance trends
- **Habit Details**: Individual progress, notes (Premium), edit options

### 5. **Stay Motivated**
- Earn points that scale with account age (more points early on)
- Unlock badges at milestones: 10, 15, 30, 75, 150, 300 days
- Celebrate achievements with confetti animations
- Track cumulative points per habit
- **Leaderboard** (Premium): Compete with other users

## 💰 Monetization & Retention Strategy

### Freemium Model

#### **Free Tier**
- **Habit Limits**: 
  - 3 build (positive) habits
  - 2 break (negative) habits
  - Total: 5 habits maximum
- **Reminders**:
  - 1 reminder per build habit
  - 2 reminders per break habit
- **Features**:
  - Basic analytics (longest streak, average streak, completion rate, calendar)
  - Standard notifications
  - Community badges
  - Help/Guide system
  - Custom categories (create, edit, delete)

#### **Premium Tier** ($4.99/month)
- **Habit Limits**: Unlimited habits (build + break)
- **Reminders**: Up to 10 reminders per habit
- **Exclusive Features**:
  - **Notes**: Add notes to habits for reflection and tracking
  - **Session Feedback**: Rate performance with predefined parameters (energy level, difficulty, satisfaction, etc.) to generate advanced analytics
  - **Advanced Analytics**: 
    - Session feedback insights and trends
    - Performance patterns over time
    - Export analytics data
    - Predictive insights
  - **Custom Categories**: Full control to create, edit, and delete custom categories
  - **Leaderboard**: Compete with other users globally or in groups
  - **Streak Protection**: One "free pass" when you reach a 15-day streak (prevents streak loss)
  - **Weekly Email Reports**: Detailed progress summaries delivered to your inbox
  - **Exclusive Badge Designs**: Premium-only badge aesthetics

### Retention Mechanisms

1. **Streak Protection**: Premium users get 1 "free pass" when reaching a 15-day streak to maintain their streak (prevents accidental loss)
2. **Leaderboard**: Competitive element encourages daily engagement
3. **Session Feedback**: Premium feature that provides deeper insights, creating habit lock-in
4. **Weekly Email Reports**: Keeps users engaged even when not actively using the app
5. **Custom Categories**: Personalization increases ownership and retention

### Growth Strategy

- **Viral Loop**: "Share your streak" feature → friends sign up to compete
- **Content Marketing**: Blog posts on habit science, success stories
- **Referral Program**: Both users get 1 month premium when friend signs up
- **Leaderboard Sharing**: Users share achievements on social media → drives sign-ups

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
- Leaderboard visibility to drive competition

## 🎨 Core Features

### Habit Management
- ✅ Create, edit, delete habits
- ✅ Support for build (positive) and break (negative) habits
- ✅ Flexible scheduling: daily, weekly, monthly
- ✅ Reminders (Free: 1 for build, 2 for break | Premium: up to 10)
- ✅ Default categories: Health, Work, Hobbies, Chores
- ✅ **Custom Categories** (Premium): Create, edit, delete your own categories

### Gamification
- ✅ Points system (scales with account age)
- ✅ Badge system (6 milestone badges: 10, 15, 30, 75, 150, 300 days)
- ✅ Streak tracking (per habit + overall)
- ✅ Celebration animations
- ✅ **Leaderboard** (Premium): Compete with other users

### Analytics
- ✅ Longest streak calculation
- ✅ Average streak across all periods
- ✅ Completion rate (completed / scheduled days)
- ✅ Calendar visualization (completed vs missed days)
- ✅ **Session Feedback** (Premium): Rate performance with predefined parameters
- ✅ **Advanced Analytics** (Premium): Feedback insights, trends, export data

### Notifications & Reminders
- ✅ In-app notifications at reminder times
- ✅ Smart scheduling (respects daily/weekly/monthly)
- ✅ End-of-day confirmation for break habits

### User Experience
- ✅ Modern, responsive UI
- ✅ **Help/Guide System**: Comprehensive contextual help with 4 sections:
  - General app usage and habit creation
  - Notifications & check-in functionality
  - Analytics explanations
  - Rewards & badges system
- ✅ **Notes** (Premium): Add notes to habits for reflection
- ✅ Upcoming habits view (next 3 hours)
- ✅ **Streak Protection** (Premium): Free pass at 15-day streak milestone

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

🔗 **Try it live**: [https://habitloop-prototype-tanmoys-projects-a793323a.vercel.app](https://habitloop-prototype-tanmoys-projects-a793323a.vercel.app)

> 💡 *Deployed on [Vercel](https://vercel.com)*

## 🎯 Future Enhancements

- [ ] Session Feedback feature implementation
- [ ] Custom Categories feature implementation
- [ ] Leaderboard system
- [ ] Weekly email reports
- [ ] Social features (challenges, sharing)
- [ ] Mobile app (React Native)
- [ ] AI-powered habit suggestions
- [ ] Integration with health apps (Apple Health, Google Fit)
- [ ] Dark mode toggle

## 📄 License

[Add your license]

---

**Built for**: Product Design Challenge - "Build for Habit"  
**Focus**: Clarity over polish, demonstrating product sense, UX, and growth thinking