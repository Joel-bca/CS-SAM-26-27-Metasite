// Anti-Cheat Service
// Monitors suspicious behavior during quiz

class AntiCheatService {
  constructor() {
    this.violations = [];
    this.isMonitoring = false;
    this.maxViolations = 3;
    this.disqualified = false;
  }

  startMonitoring() {
    if (this.isMonitoring) return;
    this.isMonitoring = true;
    this.violations = [];
    this.disqualified = false;

    // Monitor tab switching (window focus loss)
    window.addEventListener("blur", () => this.recordViolation("TAB_SWITCH"));
    window.addEventListener("focus", () => this.checkViolation());

    // Monitor right-click (context menu)
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      this.recordViolation("RIGHT_CLICK");
    });

    // Monitor keyboard shortcuts (F12, Ctrl+Shift+I, etc.)
    document.addEventListener("keydown", (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.shiftKey && e.key === "C") ||
        (e.ctrlKey && e.shiftKey && e.key === "J") ||
        (e.ctrlKey && e.key === "u")
      ) {
        e.preventDefault();
        this.recordViolation("DEV_TOOLS");
      }
    });

    // Monitor copy/paste attempts
    document.addEventListener("copy", () => this.recordViolation("COPY_ATTEMPT"));
    document.addEventListener("paste", () => this.recordViolation("PASTE_ATTEMPT"));

    // Monitor fullscreen exit
    document.addEventListener("fullscreenchange", () => {
      if (!document.fullscreenElement) {
        this.recordViolation("FULLSCREEN_EXIT");
      }
    });

    // Store monitoring state
    sessionStorage.setItem("antiCheatActive", "true");
  }

  stopMonitoring() {
    this.isMonitoring = false;
    sessionStorage.removeItem("antiCheatActive");
  }

  recordViolation(type) {
    if (!this.isMonitoring) return;

    const violation = {
      type,
      timestamp: new Date().toISOString(),
      count: this.violations.filter((v) => v.type === type).length + 1,
    };

    this.violations.push(violation);
    console.warn(`Violation detected: ${type}`);

    // Check if disqualified
    if (this.violations.length >= this.maxViolations) {
      this.disqualified = true;
      sessionStorage.setItem("studentDisqualified", "true");
      console.error("Student disqualified due to multiple violations.");
      this.triggerDisqualification();
    }
  }

  checkViolation() {
    if (this.disqualified) {
      return true;
    }
    return false;
  }

  triggerDisqualification() {
    const event = new CustomEvent("studentDisqualified", {
      detail: {
        violations: this.violations,
        message: "You have been disqualified for violating exam integrity rules.",
      },
    });
    window.dispatchEvent(event);
  }

  getViolations() {
    return this.violations;
  }

  isStudentDisqualified() {
    return (
      this.disqualified ||
      sessionStorage.getItem("studentDisqualified") === "true"
    );
  }

  resetViolations() {
    this.violations = [];
    this.disqualified = false;
    sessionStorage.removeItem("studentDisqualified");
  }
}

export default new AntiCheatService();
