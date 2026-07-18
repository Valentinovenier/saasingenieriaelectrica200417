import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectDataContext';
import { ToastProvider } from './context/ToastContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <ProjectProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ProjectProvider>
    </AuthProvider>
  </React.StrictMode>
);
