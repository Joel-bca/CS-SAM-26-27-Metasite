# Google Sheet Integration Setup Guide

## Overview
This application dynamically loads quiz questions from a **publicly published** Google Sheet. The sheet is already configured and accessible to anyone with the link.

## Published Sheet
✅ **Status:** Publicly accessible  
**Public URL:** https://docs.google.com/spreadsheets/d/1xPqMFajHY1L8PpYtUu-a9814sGI28GsPY2hpV0DNtJc/edit?usp=sharing

**Sheet Key:** `2PACX-1vQxQLHTbjEY7LAjKNMiRrfD7wEFKrUcBilsREhlTqRBj-XVIWiBRWNHEaldpMe-0yluCIEDTNHE7NGA`

---

## ✅ Setup is Complete!

The sheet has been published with "Publish to the web" settings. No additional setup is required.

To verify it's working:
1. Start the dev server: `npm run dev`
2. Navigate to the Quiz page
3. Questions should load automatically ✅

---

## Step 1: Verify Google Sheet Structure

The sheet must have the following columns in this exact order:

| Column | Header | Type | Example |
|--------|--------|------|---------|
| A | app_topic | Text | "General Knowledge Quiz" |
| B | question_numbers | Number | 1, 2, 3, ... |
| C | questions_type | Text | `mcq`, `multi`, `true_false`, `short_answer` |
| D | question | Text | "What does CPU stand for?" |
| E | options | Text (comma-separated) | "Option1, Option2, Option3" |
| F | correct_answer | Text | Single value for MCQ/True-False, comma-separated for multi |
| G | time_limit | Number (seconds) | 30, 45, 60 |
| H | marks | Number | 1, 2, 5 |
| I | explanation | Text | "Explanation of the correct answer" |

### Example Row:
```
General Knowledge Quiz | 1 | mcq | What does CPU stand for? | Central Processing Unit, Central Program Utility, Computer Personal Unit | Central Processing Unit | 30 | 1 | The CPU is the brain of the computer
```

---

## Step 2: Test the Integration

### Local Testing:
1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the Quiz page:
   - Log in with any name
   - Accept rules
   - You should see: **"Loading quiz questions..."**
   - Questions should load automatically

### Browser Console:
- Open DevTools (F12)
- Check the **Console** tab for any errors
- Look for "Loading quiz questions..." messages

---

## Troubleshooting

### Error: "Failed to load questions from Google Sheet"

**Cause 1: Sheet column headers incorrect**
- Ensure headers are exactly (case-sensitive):
  - `app_topic`, `question_numbers`, `questions_type`, `question`, `options`, `correct_answer`, `time_limit`, `marks`, `explanation`
- No extra spaces or different casing

**Cause 2: Missing or invalid data**
- Ensure every row has all required columns
- For `options` and `correct_answer`, use comma-separated values without extra spaces
- `time_limit` and `marks` must be valid numbers
- At least one question must be present

**Cause 3: Check Published Permissions**
- The sheet must be published with "Publish to the web"
- Verify by opening in an incognito window:  
  https://docs.google.com/spreadsheets/d/e/2PACX-1vQxQLHTbjEY7LAjKNMiRrfD7wEFKrUcBilsREhlTqRBj-XVIWiBRWNHEaldpMe-0yluCIEDTNHE7NGA/pubhtml

### Manually Test CSV Export:
Visit this URL in your browser:
```
https://docs.google.com/spreadsheets/d/e/2PACX-1vQxQLHTbjEY7LAjKNMiRrfD7wEFKrUcBilsREhlTqRBj-XVIWiBRWNHEaldpMe-0yluCIEDTNHE7NGA/pub?output=csv
```
- It should download a CSV file or display raw CSV text
- You should NOT see a login page

---

## Question Types Reference

### 1. MCQ (Single Choice)
```
questions_type: mcq
options: "Correct Answer, Wrong Option 1, Wrong Option 2, Wrong Option 3"
correct_answer: "Correct Answer"
```

### 2. Multiple Select
```
questions_type: multi
options: "Correct 1, Correct 2, Wrong Option, Correct 3"
correct_answer: "Correct 1, Correct 2, Correct 3"
```

### 3. True/False
```
questions_type: true_false
options: "True, False"
correct_answer: "True"
```

### 4. Short Answer
```
questions_type: short_answer
options: (leave empty)
correct_answer: "Expected Answer"
```
*Note: Short answers are case-insensitive*

---

## Technical Details

### CSV Parsing:
- Handles quoted fields with commas inside
- Skips empty rows automatically
- Trims whitespace from all values

### Question Loading:
- Questions are cached after first load (for performance)
- Cached questions cleared when app resets
- Automatic retry with CORS proxy if direct fetch fails

### Scoring:
- Each question contributes its `marks` value to the total
- Passing threshold: 60% of total marks
- Marks are awarded only for completely correct answers

---

## API Reference

### `src/utils/csvParser.ts`

```typescript
// Fetch and parse questions from Google Sheet
export async function fetchQuestionsFromSheet(): Promise<Question[]>

// Get cached questions (recommended)
export async function getQuestions(): Promise<Question[]>

// Clear cache (useful for refresh scenarios)
export function clearQuestionsCache(): void
```

### `src/contexts/QuizContext.tsx`

```typescript
// Question interface
export interface Question {
  id: number;
  type: "mcq" | "multiple" | "truefalse" | "short";
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  timeLimit: number;      // seconds
  marks: number;          // for scoring
  explanation: string;    // shown in results
}
```

---

## File Structure

```
src/
├── utils/
│   └── csvParser.ts          # Google Sheet CSV parsing logic
├── contexts/
│   └── QuizContext.tsx       # Quiz state management
├── pages/
│   ├── Quiz.tsx              # Quiz display & question loading
│   ├── Result.tsx            # Results with review section
│   └── Certificate.tsx       # Certificate generation
└── data/
    └── questions.ts          # DEPRECATED (kept for reference)
```

---

## Performance Notes

- Questions are fetched once and cached in memory
- CSV parsing happens client-side (fast)
- No backend required - fully client-side
- Large question sets (100+) load instantly

---

## Security Notes

- All data is public (accessed via public Google Sheet)
- No authentication or API keys required
- Client-side validation only (for UX, not security)
- Data is not sent anywhere except to the quiz app

---

## Support

If you encounter issues:
1. Check the Browser Console (F12) for error messages
2. Verify the sheet is publicly shared (test in incognito window)
3. Review the exact error message for troubleshooting tips
4. Check column headers match exactly
5. Ensure all required data is present

