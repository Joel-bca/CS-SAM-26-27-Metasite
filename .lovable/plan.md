

# University Quiz Portal — Implementation Plan

## Overview
A clean, professional quiz and certification platform for university students. The app follows a linear flow: Login → Rules → Quiz → Results → Certificate/Retake. No backend required — all state managed client-side.

## Design System
- **Color palette**: Deep navy blue primary (`#1e3a5f`), white backgrounds, soft gray accents
- **Typography**: Inter font family, clear hierarchy
- **Style**: Minimalistic, academic, accessible, no gamification
- **Components**: Built on existing shadcn/ui primitives (Card, Button, Input, Select, Checkbox, Progress, Badge, RadioGroup, Tabs)

---

## Pages & Features

### 1. Login Page (`/`)
- Centered card (max-width ~480px) with soft shadow
- Fields: Full Name, Registration Number, Department (dropdown)
- Confirmation checkbox + disabled "Start Quiz" button until valid
- Inline validation messages

### 2. Rules & Regulations Page (`/rules`)
- Scrollable card listing all quiz rules (time limits, no tab switching, no refresh, etc.)
- "I have read and agree" checkbox
- "Begin Quiz" button disabled until checked

### 3. Quiz Page (`/quiz`)
- **Desktop**: Two-column layout — questions left, timer/progress right
- **Mobile**: Single column, timer above question
- Question number indicator (e.g., "Question 3 of 15")
- Supports MCQ (radio), multiple select (checkboxes), true/false (toggle), short answer (text input)
- Per-question countdown timer with auto-advance on expiry
- Progress bar showing completion percentage
- Previous / Next navigation, Submit on last question
- Tab-switching detection with subtle warning banner

### 4. Result Page (`/result`)
- Summary card: Student name, score, max score
- Pass/Fail badge with green/red accent
- "Download Certificate" button if passed
- "Retake Quiz" button if failed (resets quiz, keeps student info)

### 5. Certificate Page (`/certificate`)
- Landscape certificate preview with academic styling
- Student name, quiz title, completion date, signature placeholder
- University-themed border, serif font for title
- "Download Certificate (PDF)" button (client-side PDF generation)

---

## Global Elements
- **Header**: "University Quiz Portal" — minimal, no external links during quiz
- **Footer** on all pages: Centered, light gray, with separator line
  - Created by: Paul Joel P | 2 BCA B, Shalini Alamelu | 2 BCA B, Kishan J | 2 BCA B

## Technical Approach
- React Router for page navigation with route guards (can't skip to quiz without login)
- React Context for quiz state (student info, answers, score, timer)
- Sample question set with mixed question types (hardcoded, easily replaceable)
- Fully responsive with Tailwind CSS
- Client-side PDF certificate generation
- No backend dependencies

