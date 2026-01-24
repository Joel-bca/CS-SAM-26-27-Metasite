# National Voters' Day Quiz - Interactive Learning Platform

A modern, interactive React-based Single Page Application (SPA) for National Voters' Day Quiz hosted at Christ University. This application helps students understand voting rights, election processes, and civic responsibilities through an engaging quiz experience.

## 🎯 Features

### 1. **Simple Registration** 
   - Collect participant name only
   - Browser localStorage integration for data persistence
   - Clean, intuitive UI with form validation

### 2. **Comprehensive Quiz**
   - 20 multiple-choice questions on voter education topics
   - All questions displayed on a single page
   - Real-time answer tracking
   - Answer review and edit capability before final submission
   - Progress indicator showing completion status

### 3. **Detailed Results & Scoresheet**
   - Calculate overall quiz score (percentage and count)
   - Display detailed scoresheet showing:
     - Each question with user's answer
     - Correct answer for comparison
     - Visual indicators (✓ for correct, ✗ for incorrect)
     - Color-coded feedback (green for correct, red for incorrect)
   - Performance-based motivational messages
   - Option to retake the quiz

### 4. **Dynamic Certificate**
   - Auto-populated with participant name from registration
   - Professional certificate design using external image template
   - Download certificate as PNG image
   - Fully responsive certificate display

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone or download the project**
   ```bash
   cd IC_voters
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:5173` (or the URL shown in terminal)

## 📋 Application Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. REGISTRATION PAGE (/register)                            │
│    - User enters their name                                 │
│    - Name stored in browser localStorage                    │
│    - Click "Start Quiz" button                              │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. QUIZ PAGE (/quiz)                                        │
│    - Display all 20 voter education questions               │
│    - User selects answers (A, B, C, or D)                  │
│    - Progress indicator shows answered questions            │
│    - "Submit Quiz & View Results" button when all answered  │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. RESULTS PAGE (In-page)                                   │
│    - Show total score and performance analysis              │
│    - Display detailed scoresheet with Q&A comparison        │
│    - Options:                                               │
│      • View Certificate button → to certificate             │
│      • Retake Quiz button → back to quiz with cleared data  │
│      • Go Home button → return to registration              │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. CERTIFICATE PAGE (international.html)                    │
│    - Professional certificate with participant name         │
│    - Download Certificate button (PNG format)               │
│    - Go Home button to restart                              │
└─────────────────────────────────────────────────────────────┘
```

## 🎨 UI/UX Features

- **Modern Design**: Gradient backgrounds, smooth animations, responsive layout
- **Color Scheme**: 
  - Primary Blue: #003a8f (Christ University branding)
  - Success Green: #1a9c4b
  - Gold Accent: #d4af37
  - Light backgrounds for contrast
- **Animations**: Framer Motion powered smooth transitions and micro-interactions
- **Icons**: React Icons for visual enhancement (FaUserGraduate, FaCheckCircle, etc.)
- **Responsive**: Works seamlessly on desktop, tablet, and mobile devices

## 📁 Project Structure

```
IC_voters/
├── src/
│   ├── pages/
│   │   ├── register.jsx          # Registration page component
│   │   └── quiz.jsx              # Quiz and results component
│   ├── styles/
│   │   ├── register.css          # Styling for registration & general
│   │   └── quiz.css              # Styling for quiz & results
│   ├── App.jsx                   # Main app with routes
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Global styles
├── international.html             # Certificate template page
├── public/                        # Static assets
│   └── christ-logo.png           # University logo
├── package.json                   # Dependencies
├── vite.config.js                # Vite configuration
└── README.md                      # This file
```

## 🧠 Quiz Questions (20 Total)

The quiz covers essential topics about voting and elections in India:

1. International Voters' Day celebration date (25 January)
2. Institution celebrated on International Voters' Day (Election Commission of India)
3. Election Commission establishment year (1950)
4. Objective of International Voters' Day (Encourage voter awareness)
5. Voting eligibility (Citizens above 18 years)
6. Nature of voting rights (Legal Right)
7. Common voting proof document (Voter ID Card)
8. First International Voters' Day in India (2011)
9. Target audience for celebrations (First-time voters)
10. Election Commission's main role (Conduct free and fair elections)
... and 10 more questions on electoral processes, constitutional provisions, and civic engagement.

## 💾 Data Storage

**All data is stored in browser localStorage:**

- `voterName`: Participant's registered name
- `quizAnswers`: Array of user's answers (0-indexed, -1 for unanswered)
- `quizCompleted`: Boolean flag indicating completion

**No backend or database is required.** Data persists during the session but is cleared when the user clicks "Go Home".

## 🔄 Technology Stack

| Technology | Purpose |
|-----------|---------|
| **React 19.2.0** | UI framework |
| **Vite** | Fast build tool & dev server |
| **React Router DOM 7.13.0** | Client-side routing (/register, /quiz) |
| **Framer Motion 12.29.0** | Smooth animations & transitions |
| **React Icons 5.5.0** | Icon library |
| **CSS3** | Styling with gradients, flexbox, grid |
| **localStorage API** | Client-side data persistence |

## 🎓 Educational Content

Questions are designed to educate students about:
- National civic participation and voting rights
- India's election system and Election Commission
- Constitutional provisions (Articles 14, 19, 324, 356)
- Electoral processes and voter responsibilities
- Democratic values and citizen engagement

## 📱 Responsive Breakpoints

- **Desktop**: Full width layout, grid-based question display
- **Tablet** (≤768px): Adjusted spacing, single column for some elements
- **Mobile** (≤480px): Stack layout, larger touch targets

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Browser DevTools Tips

- Use localStorage inspector to view stored data: `localStorage.getItem('voterName')`
- Check quiz answers: `JSON.parse(localStorage.getItem('quizAnswers'))`

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Quiz doesn't load | Ensure you've completed registration (voterName in localStorage) |
| Name not showing on certificate | Check browser localStorage hasn't been cleared |
| Certificate download fails | Ensure html2canvas CDN is accessible |
| Styles not applying | Clear browser cache and restart dev server |

## 🔒 Privacy & Security

- **No backend**: All quiz data stays on user's device
- **No tracking**: No external services track user progress
- **Browser-only**: No data is sent to any server
- **Clear data**: Users can clear all data by clicking "Go Home"

## 📸 Screenshots

### Registration Page
- Clean form with single name input
- "Start Quiz" call-to-action button
- Christ University branding

### Quiz Page
- 20 questions displayed with progress indicator
- Multiple choice options (A, B, C, D)
- Visual feedback for answered questions

### Results Page
- Large score circle with percentage
- Correct/incorrect counts
- Detailed scoresheet with comparison
- Color-coded answers (green ✓, red ✗)

### Certificate
- Professional design with participant name
- Download button for PNG export
- Home button to restart

## 🤝 Contributing

To improve the quiz questions or add features:

1. Edit quiz questions in [quiz.jsx](src/pages/quiz.jsx) - `quizQuestions` array
2. Modify styling in [quiz.css](src/styles/quiz.css) or [register.css](src/styles/register.css)
3. Add new routes in [App.jsx](src/App.jsx)

## 📝 License

This project is developed for Christ University - Yeshwanthpur Campus for National Voters' Day educational purposes.

## 📧 Support

For issues or questions, contact the development team or refer to the code comments for additional documentation.

---

**Made with ❤️ for National Voters' Day 2026**
**Christ University - Yeshwanthpur Campus**
