"use client";

import { useTheme } from "@/app/providers/ThemeProvider";


export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
      className="border rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white"
    >
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">System</option>
    </select>
  );
} 