import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'light',
    toggleTheme: () => { },
    setTheme: () => { },
});

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(() => {
        const saved = localStorage.getItem('plotnest_theme');
        return (saved === 'light' || saved === 'dark') ? saved : 'light';
    });

    useEffect(() => {
        localStorage.setItem('plotnest_theme', theme);
        // Apply class to html element for global awareness
        if (theme === 'light') {
            document.documentElement.classList.add('plotnest-light');
            document.documentElement.classList.remove('plotnest-dark');
        } else {
            document.documentElement.classList.add('plotnest-dark');
            document.documentElement.classList.remove('plotnest-light');
        }
    }, [theme]);

    const setTheme = (t: Theme) => setThemeState(t);
    const toggleTheme = () => setThemeState(prev => prev === 'dark' ? 'light' : 'dark');

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
