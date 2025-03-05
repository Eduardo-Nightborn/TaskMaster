import { Moon, Sun } from 'lucide-react'
import { Switch } from "@/components/ui/switch"
import { useThemeStore } from '../store/theme-store'

export function ThemeToggle() {
    const { theme, toggleTheme } = useThemeStore()

    return (
        <div className="flex items-center justify-between w-full px-4 py-2 mt-auto">
            <div className="flex items-center space-x-2">
                {theme === 'light' ? (
                    <>
                        <Sun className="h-4 w-4" />
                        <span className="text-sm">Light Mode</span>
                    </>
                ) : (
                    <>
                        <Moon className="h-4 w-4" />
                        <span className="text-sm">Dark Mode</span>
                    </>
                )}
            </div>
            <Switch
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
                aria-label="Toggle theme"
            />
        </div>
    )
} 