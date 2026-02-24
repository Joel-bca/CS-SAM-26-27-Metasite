import { Question } from "@/contexts/QuizContext";

// Published Google Sheet key (from shared public link)
const PUBLISHED_SHEET_KEY = "2PACX-1vQxQLHTbjEY7LAjKNMiRrfD7wEFKrUcBilsREhlTqRBj-XVIWiBRWNHEaldpMe-0yluCIEDTNHE7NGA";
// CSV export URL for published sheet
const CSV_URL = `https://docs.google.com/spreadsheets/d/e/${PUBLISHED_SHEET_KEY}/pub?output=csv`;
// Fallback direct sheet ID (legacy support)
const SHEET_ID = "1xPqMFajHY1L8PpYtUu-a9814sGI28GsPY2hpV0DNtJc";
const FALLBACK_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;
// Alternative: use a more reliable CORS proxy
const ALTERNATIVE_PROXY = "https://api.allorigins.win/raw?url=";

type QuestionType = "mcq" | "multiple" | "truefalse" | "short";

interface CSVRow {
  app_topic: string;
  question_numbers: string;
  questions_type: string;
  question: string;
  options: string;
  correct_answer: string;
  time_limit: string;
  marks: string;
  explanation: string;
}

/**
 * Maps CSV question types to internal type names
 */
function mapQuestionType(csvType: string): QuestionType {
  const typeMap: Record<string, QuestionType> = {
    "mcq": "mcq",
    "multi": "multiple",
    "true_false": "truefalse",
    "short_answer": "short",
  };
  return typeMap[csvType.trim().toLowerCase()] || "mcq";
}

/**
 * Parses CSV content into Question objects
 */
function parseCSVContent(csvContent: string): Question[] {
  const lines = csvContent.trim().split("\n");
  if (lines.length < 2) {
    throw new Error("CSV must contain headers and at least one data row");
  }

  // Parse header
  const headers = parseCSVLine(lines[0]);
  const headerMap: Record<string, number> = {};
  headers.forEach((h, i) => {
    headerMap[h.toLowerCase().trim()] = i;
  });

  // Validate required headers
  const requiredHeaders = [
    "question_numbers",
    "questions_type",
    "question",
    "options",
    "correct_answer",
    "time_limit",
    "marks",
    "explanation",
  ];
  for (const h of requiredHeaders) {
    if (!(h in headerMap)) {
      throw new Error(`Missing required header: ${h}`);
    }
  }

  // Parse data rows
  const questions: Question[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines

    const values = parseCSVLine(line);
    const row: CSVRow = {
      app_topic: values[headerMap["app_topic"] || 0] || "",
      question_numbers: values[headerMap["question_numbers"]] || "",
      questions_type: values[headerMap["questions_type"]] || "",
      question: values[headerMap["question"]] || "",
      options: values[headerMap["options"]] || "",
      correct_answer: values[headerMap["correct_answer"]] || "",
      time_limit: values[headerMap["time_limit"]] || "30",
      marks: values[headerMap["marks"]] || "1",
      explanation: values[headerMap["explanation"]] || "",
    };

    if (!row.question.trim()) continue; // Skip rows without question

    const type = mapQuestionType(row.questions_type);
    const options = row.options
      .split(",")
      .map((o) => o.trim())
      .filter((o) => o);

    // Parse correct answer based on question type
    let correctAnswer: string | string[] = row.correct_answer.trim();
    if (type === "multiple") {
      correctAnswer = row.correct_answer
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a);
    }

    const question: Question = {
      id: questions.length + 1,
      type,
      question: row.question.trim(),
      options: options.length > 0 ? options : undefined,
      correctAnswer,
      timeLimit: Math.max(10, Math.min(180, parseInt(row.time_limit) || 30)),
      marks: Math.max(1, parseInt(row.marks) || 1),
      explanation: row.explanation.trim(),
    };

    questions.push(question);
  }

  if (questions.length === 0) {
    throw new Error("No valid questions found in CSV");
  }

  return questions;
}

/**
 * Parses a CSV line handling quotes and commas
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

/**
 * Fetches questions from Google Sheet CSV
 * Tries multiple approaches to handle CORS and redirects
 */
export async function fetchQuestionsFromSheet(): Promise<Question[]> {
  const approaches = [
    // Approach 1: Published sheet (most reliable)
    async () => {
      const response = await fetch(CSV_URL);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.text();
    },
    
    // Approach 2: Fallback to direct sheet export
    async () => {
      const response = await fetch(FALLBACK_CSV_URL);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.text();
    },
    
    // Approach 3: Using allorigins.win proxy (reliable alternative for either URL)
    async () => {
      const encodedUrl = encodeURIComponent(CSV_URL);
      const response = await fetch(`${ALTERNATIVE_PROXY}${encodedUrl}`);
      if (!response.ok) throw new Error(`Proxy error: ${response.status}`);
      return response.text();
    },
    
    // Approach 4: Proxy fallback URL
    async () => {
      const encodedUrl = encodeURIComponent(FALLBACK_CSV_URL);
      const response = await fetch(`${ALTERNATIVE_PROXY}${encodedUrl}`);
      if (!response.ok) throw new Error(`Proxy error: ${response.status}`);
      return response.text();
    },
  ];

  let lastError: Error | null = null;

  for (let i = 0; i < approaches.length; i++) {
    try {
      const csvContent = await approaches[i]();
      const questions = parseCSVContent(csvContent);
      return questions;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      // Continue to next approach
    }
  }

  // All approaches failed
  throw new Error(
    `Failed to load questions from Google Sheet.\n\n` +
    `Published Sheet URL: https://docs.google.com/spreadsheets/d/e/${PUBLISHED_SHEET_KEY}/pubhtml\n\n` +
    `The sheet appears to be inaccessible. Please verify:\n` +
    `• The sheet link is publicly shared\n` +
    `• Column headers are correct (app_topic, question_numbers, questions_type, etc.)\n` +
    `• At least one question exists in the sheet\n\n` +
    `Last error: ${lastError?.message}`
  );
}

/**
 * Fetches and caches questions (for performance)
 */
let cachedQuestions: Question[] | null = null;
export async function getQuestions(): Promise<Question[]> {
  if (cachedQuestions) {
    return cachedQuestions;
  }
  const questions = await fetchQuestionsFromSheet();
  cachedQuestions = questions;
  return questions;
}

/**
 * Clears the cache (useful for testing or refresh scenarios)
 */
export function clearQuestionsCache(): void {
  cachedQuestions = null;
}
