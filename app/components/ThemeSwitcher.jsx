'use client'

import { useContext } from 'react'
import { DarkModeContext } from '../layout'
import { Moon, Sun } from 'lucide-react'

export default function ThemeSwitcher() {
    const { darkMode, setDarkMode } = useContext(DarkModeContext)

    const toggleTheme = () => setDarkMode(!darkMode)

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-slate-700 hover:scale-110 transition"
            aria-label="Toggle theme"
        >
            {darkMode ? (
                <Sun className="w-6 h-6 text-yellow-400" />
            ) : (
                <Moon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
            )}
        </button>
    )
}
