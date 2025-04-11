
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from './integrations/supabase/client';
import { AuthProvider } from './contexts/AuthContext';
import { WorkspaceProvider } from './contexts/WorkspaceContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { ShopifyProtected } from './components/ShopifyProtected';
import MaterialThemeProvider from './components/Theme/MaterialThemeProvider';
import { routes } from './routes';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    console.log('User signed in:', session);
  } else if (event === 'SIGNED_OUT') {
    console.log('User signed out');
    // Clear any cached data when user signs out
    queryClient.clear();
  }
});

function App() {
  return (
    <MaterialThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <WorkspaceProvider>
            <Router>
              <div className="app-container full-width full-height">
                <Routes>
                  {routes.map((route) => {
                    const Element = route.element;
                    
                    if (route.path === '/dashboard/shopify' || route.path === '/dashboard/shopify/:storeId') {
                      return (
                        <Route
                          key={route.path}
                          path={route.path}
                          element={
                            <ProtectedRoute>
                              <ShopifyProtected>
                                <Element />
                              </ShopifyProtected>
                            </ProtectedRoute>
                          }
                        />
                      );
                    } else if (route.path.startsWith('/dashboard')) {
                      return (
                        <Route
                          key={route.path}
                          path={route.path}
                          element={
                            <ProtectedRoute>
                              <Element />
                            </ProtectedRoute>
                          }
                        />
                      );
                    } else {
                      return (
                        <Route
                          key={route.path}
                          path={route.path}
                          element={<Element />}
                        />
                      );
                    }
                  })}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <Toaster richColors closeButton position="top-right" />
              </div>
            </Router>
          </WorkspaceProvider>
        </AuthProvider>
      </QueryClientProvider>
    </MaterialThemeProvider>
  );
}

export default App;
