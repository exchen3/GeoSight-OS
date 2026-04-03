/**
 * GeoSight is UNICEF's geospatial web-based business intelligence platform.
 *
 * Contact : geosight-no-reply@unicef.org
 *
 * .. note:: This program is free software; you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as published by
 *     the Free Software Foundation; either version 3 of the License, or
 *     (at your option) any later version.
 *
 * __author__ = 'unicef'
 * __date__ = '28/03/2026'
 * __copyright__ = ('Copyright 2026, Unicef')
 */

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type ColorMode = 'light' | 'dark';

const STORAGE_KEY = 'geosight-color-mode';

interface ThemeContextValue {
  colorMode: ColorMode;
  toggleColorMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  colorMode: 'light',
  toggleColorMode: () => {},
});

function getInitialColorMode(): ColorMode {
  // Check localStorage first
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as ColorMode | null;
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
  } catch (_) {}

  // Fall back to system preference
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

function applyColorMode(mode: ColorMode) {
  document.documentElement.setAttribute('data-color-mode', mode);
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch (_) {}
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorMode, setColorMode] = useState<ColorMode>(() => {
    const initial = getInitialColorMode();
    applyColorMode(initial);
    return initial;
  });

  const toggleColorMode = useCallback(() => {
    setColorMode(prev => {
      const next: ColorMode = prev === 'light' ? 'dark' : 'light';
      applyColorMode(next);
      return next;
    });
  }, []);

  // Sync if system preference changes and user hasn't set a manual preference
  useEffect(() => {
    const media = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!media) return;
    const handler = (e: MediaQueryListEvent) => {
      // Only auto-switch if no manual preference stored
      try {
        if (!localStorage.getItem(STORAGE_KEY)) {
          const mode: ColorMode = e.matches ? 'dark' : 'light';
          setColorMode(mode);
          applyColorMode(mode);
        }
      } catch (_) {}
    };
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  return (
    <ThemeContext.Provider value={{ colorMode, toggleColorMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
