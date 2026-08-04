"use client";

export default function ThemeToggle() {
  function toggleTheme() {
    const root = document.documentElement;
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";

    root.dataset.theme = nextTheme;
    localStorage.setItem("theme", nextTheme);
  }

  return (
    <button
      aria-label="색상 모드 전환"
      className="theme-button"
      onClick={toggleTheme}
      title="색상 모드 전환"
      type="button"
    >
      <svg
        aria-hidden="true"
        className="theme-icon theme-icon--moon"
        fill="none"
        height="24"
        viewBox="0 0 24 24"
        width="24"
      >
        <path
          d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
      <svg
        aria-hidden="true"
        className="theme-icon theme-icon--sun"
        fill="none"
        height="24"
        viewBox="0 0 24 24"
        width="24"
      >
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
        <path
          d="M12 2V4M12 20V22M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M2 12H4M20 12H22M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
        />
      </svg>
    </button>
  );
}
