
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Workspace } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Mock data - in a real app, this would be fetched from the database
const defaultWorkspace: Workspace = {
  id: 'default',
  name: 'Default Workspace',
  description: 'Your default workspace',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ownerId: '',
  isDefault: true
};

interface WorkspaceContextType {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  setCurrentWorkspace: (workspace: Workspace) => void;
  createWorkspace: (name: string, description?: string) => Promise<Workspace>;
  updateWorkspace: (id: string, data: Partial<Workspace>) => Promise<void>;
  deleteWorkspace: (id: string) => Promise<void>;
  isLoading: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([defaultWorkspace]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(defaultWorkspace);
  const [isLoading, setIsLoading] = useState(false);

  // Load workspaces when user logs in
  useEffect(() => {
    if (user) {
      setIsLoading(true);
      
      // Simulate API call to fetch workspaces
      setTimeout(() => {
        // This would be replaced with an actual API call
        const mockWorkspaces = [
          defaultWorkspace,
          {
            id: 'ws1',
            name: 'Content Marketing',
            description: 'Workspace for all content marketing efforts',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ownerId: user.id
          },
          {
            id: 'ws2',
            name: 'SEO Projects',
            description: 'Workspace for SEO optimization projects',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ownerId: user.id
          }
        ];
        
        setWorkspaces(mockWorkspaces);
        setIsLoading(false);
      }, 800);
    } else {
      // Reset to default if user logs out
      setWorkspaces([defaultWorkspace]);
      setCurrentWorkspace(defaultWorkspace);
    }
  }, [user]);

  const createWorkspace = async (name: string, description?: string): Promise<Workspace> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          const newWorkspace: Workspace = {
            id: `ws-${Date.now()}`,
            name,
            description,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ownerId: user?.id || 'anonymous'
          };
          
          setWorkspaces(prev => [...prev, newWorkspace]);
          toast.success(`Workspace "${name}" created successfully!`);
          setIsLoading(false);
          resolve(newWorkspace);
        }, 600);
      });
    } catch (error) {
      setIsLoading(false);
      toast.error('Failed to create workspace');
      throw error;
    }
  };

  const updateWorkspace = async (id: string, data: Partial<Workspace>): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          setWorkspaces(prev => 
            prev.map(ws => ws.id === id ? { ...ws, ...data, updatedAt: new Date().toISOString() } : ws)
          );
          
          // Update current workspace if it's the one being updated
          if (currentWorkspace?.id === id) {
            setCurrentWorkspace(prev => prev ? { ...prev, ...data, updatedAt: new Date().toISOString() } : prev);
          }
          
          toast.success('Workspace updated successfully!');
          setIsLoading(false);
          resolve();
        }, 600);
      });
    } catch (error) {
      setIsLoading(false);
      toast.error('Failed to update workspace');
      throw error;
    }
  };

  const deleteWorkspace = async (id: string): Promise<void> => {
    if (id === defaultWorkspace.id) {
      toast.error('Cannot delete the default workspace');
      return Promise.reject(new Error('Cannot delete the default workspace'));
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          setWorkspaces(prev => prev.filter(ws => ws.id !== id));
          
          // If current workspace is deleted, switch to default
          if (currentWorkspace?.id === id) {
            setCurrentWorkspace(defaultWorkspace);
          }
          
          toast.success('Workspace deleted successfully');
          setIsLoading(false);
          resolve();
        }, 600);
      });
    } catch (error) {
      setIsLoading(false);
      toast.error('Failed to delete workspace');
      throw error;
    }
  };

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        currentWorkspace,
        setCurrentWorkspace,
        createWorkspace,
        updateWorkspace,
        deleteWorkspace,
        isLoading
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
