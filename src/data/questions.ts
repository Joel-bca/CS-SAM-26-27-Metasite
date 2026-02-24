import { getQuestions } from "@/utils/csvParser";

// Passing criteria: 60% of total marks
export const PASSING_MARKS_PERCENTAGE = 60;

/**
 * DEPRECATED: Use getQuestions() from csvParser instead
 * This is kept for backward compatibility but will be removed in future versions
 */
export { getQuestions as getQuestionsFromSheet };
