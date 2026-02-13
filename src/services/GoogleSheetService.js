const API_KEY = "AIzaSyATFwoxzG7d7cQxzKxaGYn-6sT0LoFKCmc"; // Replace with your restricted API Key
const SHEET_ID = "1xPqMFajHY1L8PpYtUu-a9814sGI28GsPY2hpV0DNtJc";
const RANGE = "Sheet1!A2:H"; // Range skips the header row

const GoogleSheetService = {
  fetchQuestions: async () => {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const rows = data.values;

      if (!rows || rows.length === 0) {
        console.warn("No data found in the specified range.");
        return [];
      }

      // Map the 2D array from Google API to your Quiz objects
      return rows.map((row, index) => ({
        id: parseInt(row[0]) || index + 1,        // Column A
        question: row[1] || "",                    // Column B
        timeLimit: parseInt(row[2]) || 30,        // Column C
        options: [
          row[3] || "", // Column D
          row[4] || "", // Column E
          row[5] || "", // Column F
          row[6] || ""  // Column G
        ],
        // Handles if the sheet has "0" or "optionA"
        correct: GoogleSheetService.parseCorrectAnswer(row[7]), // Column H
      }));
    } catch (error) {
      console.error("Failed to fetch from Google Sheets API:", error);
      throw error;
    }
  },

  parseCorrectAnswer: (val) => {
    if (!val) return 0;
    const mapping = { "optionA": 0, "optionB": 1, "optionC": 2, "optionD": 3 };
    return mapping[val] !== undefined ? mapping[val] : (parseInt(val) || 0);
  }
};

export default GoogleSheetService;