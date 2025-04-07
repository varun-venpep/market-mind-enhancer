
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from "@/components/theme-provider"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from './integrations/supabase/client';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { ShopifyProtected } from './components/ShopifyProtected';
import routes from './routes';
import './App.css';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import AdminSubscriptionPage from './pages/AdminSubscription';

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
    <ThemeProvider defaultTheme="light" storageKey="seo-wizard-ui-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SubscriptionProvider>
            <Router>
              <div className="app-container full-width full-height">
                <Routes>
                  {routes.map((route) => {
                    if (route.path === '/dashboard/shopify' || route.path === '/dashboard/shopify/:id') {
                      return (
                        <Route
                          key={route.path}
                          path={route.path}
                          element={
                            <ProtectedRoute>
                              <ShopifyProtected>
                                <route.component />
                              </ShopifyProtected>
                            </ProtectedRoute>
                          }
                        />
                      );
                    } else if (route.protected) {
                      return (
                        <Route
                          key={route.path}
                          path={route.path}
                          element={
                            <ProtectedRoute>
                              <route.component />
                            </ProtectedRoute>
                          }
                        />
                      );
                    } else {
                      return (
                        <Route
                          key={route.path}
                          path={route.path}
                          element={<route.component />}
                        />
                      );
                    }
                  })}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <Toaster richColors closeButton position="top-right" />
              </div>
            </Router>
          </SubscriptionProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
