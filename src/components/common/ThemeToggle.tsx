import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { Theme } from '@/types';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'system'];
    const nextIndex = (themes.indexOf(theme) + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const themeLabels: Record<Theme, string> = {
    light: 'Warm Archival Paper (Light)',
    dark: 'Evening Reading Room (Dark)',
    system: 'System Default',
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      className="h-8 w-8 rounded-sm border border-transparent hover:border-border text-muted-foreground hover:text-foreground"
      title={`Reading mode: ${themeLabels[theme]}. Click to switch.`}
      aria-label={`Current theme: ${theme}. Click to switch theme.`}
    >
      {theme === 'light' && <Sun className="h-4 w-4 text-primary" />}
      {theme === 'dark' && <Moon className="h-4 w-4 text-primary" />}
      {theme === 'system' && <Monitor className="h-4 w-4 text-muted-foreground" />}
    </Button>
  );
};
