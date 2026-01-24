# Before & After - Timer Implementation

## The Problem: Timer Broken After First Question

The original implementation had multiple critical flaws that caused the timer to stop, freeze, or behave unpredictably.

---

## BEFORE (Broken Implementation)

### ❌ Problem 1: Separate Timer Effects = Race Conditions

```javascript
// OLD: Countdown Effect
useEffect(() => {
  if (!quizStarted || showResults || isDisqualified) return;

  const timer = setInterval(() => {
    setTimeLeft((prev) => Math.max(0, prev - 1));  // ← Race condition
  }, 1000);

  return () => clearInterval(timer);
}, [quizStarted, showResults, isDisqualified]);  // ← Missing currentQuestionIndex

// OLD: Reset Timer Effect
useEffect(() => {
  if (!quizStarted || showResults || isDisqualified) return;
  setTimeLeft(30);  // ← Runs on every render
}, [currentQuestionIndex, quizStarted, showResults, isDisqualified]);

// OLD: Auto-Advance Effect
useEffect(() => {
  if (!quizStarted || showResults || isDisqualified || timeLeft > 0) return;

  if (currentQuestionIndex < quizQuestions.length - 1) {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  } else {
    const score = calculateScore();
    // ... submit logic
  }
}, [timeLeft, currentQuestionIndex, quizStarted, showResults, isDisqualified, quizQuestions.length]);
```

**Issues:**
- ❌ Three separate useEffect hooks = complexity and bugs
- ❌ Countdown effect missing currentQuestionIndex dependency
- ❌ Reset effect runs on every render = constant resets
- ❌ Race conditions between state updates
- ❌ Functional update `Math.max(0, prev - 1)` can delay countdown
- ❌ No explicit timer cleanup between questions

---

### ❌ Problem 2: Handlers Don't Destroy Timers

```javascript
// OLD: No timer cleanup
const handleAnswerChange = (questionIndex, optionIndex) => {
  const newAnswers = [...answers];
  newAnswers[questionIndex] = optionIndex;
  setAnswers(newAnswers);
  localStorage.setItem("quizAnswers", JSON.stringify(newAnswers));
  // ❌ Timer still running!
};

const moveToNextQuestion = () => {
  if (currentQuestionIndex < quizQuestions.length - 1) {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setTimeLeft(30);  // ❌ Trying to set timeLeft, but timer still running!
  }
};
```

**Result:** 
- ❌ Timers accumulate and run simultaneously
- ❌ setState calls conflict
- ❌ Timer keeps counting even after question changes

---

### ❌ Problem 3: No Timer Reference

```javascript
// OLD: No way to stop a specific timer
// Timer stored only in interval ID, lost when effect re-runs
// Multiple intervals created and not cleaned up
```

---

## AFTER (Fixed Implementation)

### ✅ Solution 1: Single Timer Reference

```javascript
const timerRef = useRef(null); // ← One reference to rule them all
```

**Benefits:**
- ✅ Only ONE interval active at a time
- ✅ Can explicitly destroy timer before creating new one
- ✅ Persists across renders
- ✅ No orphaned timers

---

### ✅ Solution 2: Main Timer Effect (Consolidated)

```javascript
useEffect(() => {
  // Exit conditions
  if (!quizStarted || showResults || isDisqualified) {
    return;
  }

  // CLEANUP: Always destroy old timer first
  if (timerRef.current) {
    clearInterval(timerRef.current);
  }

  // Initialize
  let currentTime = 30;  // ← Closure variable, not state
  setTimeLeft(30);

  // Create fresh timer
  timerRef.current = setInterval(() => {
    currentTime -= 1;  // ← Accurate, no race condition
    setTimeLeft(currentTime);  // ← Just update UI

    // Auto-advance logic
    if (currentTime <= 0) {
      clearInterval(timerRef.current);
      timerRef.current = null;

      setCurrentQuestionIndex((prevIndex) => {
        if (prevIndex < quizQuestions.length - 1) {
          return prevIndex + 1;  // ← Advance only, don't submit
        }
        return prevIndex;  // ← Let other effect handle last Q
      });
    }
  }, 1000);