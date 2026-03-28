// src/app/providers/AppProviders.js
import React from "react";

export default function AppProviders({ children }) {
  // TODO: Wrap with ThemeProvider, AuthProvider, QueryClientProvider, etc.
  return <>{children}</>;
}
