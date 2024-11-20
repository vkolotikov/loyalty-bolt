import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ClientProvider } from './context/ClientContext';
import { AdminProvider } from './context/AdminContext';
import HomePage from './pages/HomePage';
import ClientPage from './pages/ClientPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminProvider>
        <ClientProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/client/:method" element={<ClientPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            </Routes>
          </BrowserRouter>
        </ClientProvider>
      </AdminProvider>
    </QueryClientProvider>
  );
}

export default App;