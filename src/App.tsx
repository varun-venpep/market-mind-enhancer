
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WorkspaceProvider } from './contexts/WorkspaceContext';
import { ShopifyProtected } from './components/ShopifyProtected';
import { ThemeProvider } from './components/theme-provider';
import { ClerkProviderWithTheme } from './contexts/ClerkContext';
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut } from '@clerk/clerk-react';
import { Loader2 } from 'lucide-react';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import routes from './routes';
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ClerkProviderWithTheme>
          <ClerkLoading>
            <div className="flex justify-center items-center h-screen">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          </ClerkLoading>
          <ClerkLoaded>
            <WorkspaceProvider>
              <Router>
                <div className="app-container full-width full-height">
                  <Routes>
                    {routes.map((route) => {
                      if (route.path === '/dashboard/shopify' || route.path === '/dashboard/shopify/:storeId') {
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
            </WorkspaceProvider>
          </ClerkLoaded>
        </ClerkProviderWithTheme>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
