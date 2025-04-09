
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import { WorkspaceList } from '@/components/Workspace/WorkspaceList';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function Workspaces() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Button>
          </div>
          
          <div className="space-y-8">
            <WorkspaceList />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
