import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { RepositoryProvider } from './src/application/contexts/RepositoryContext';
import { ThemeProvider } from './src/application/contexts/ThemeContext';
import { LanguageProvider } from './src/application/contexts/LanguageContext';
import { ToastProvider } from './src/application/contexts/ToastContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ToastProvider>
      <RepositoryProvider>
        <ThemeProvider>
          <LanguageProvider>
            <App />
          </LanguageProvider>
        </ThemeProvider>
      </RepositoryProvider>
    </ToastProvider>
  </React.StrictMode>
);