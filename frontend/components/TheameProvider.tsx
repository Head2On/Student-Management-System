'use client';

import * as React from 'react';
// This is the core library that manages theme state
import { ThemeProvider as NextThemesProvider } from 'next-themes';
// This is for TypeScript to understand the props
import { type ThemeProviderProps } from 'next-themes';

/**
 * This component wraps your entire application and provides the theme context.
 * It allows any component in your app (like your Settings page) to access
 * and change the current theme (light/dark).
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // We are just re-exporting the provider from the library with our own component name
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
