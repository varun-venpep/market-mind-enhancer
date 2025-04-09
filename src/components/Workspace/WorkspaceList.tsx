
import React, { useState } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Workspace } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Check, Edit, FolderOpen, MoreHorizontal, Plus, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

export function WorkspaceList() {
  const { workspaces, currentWorkspace, setCurrentWorkspace, createWorkspace, updateWorkspace, deleteWorkspace, isLoading } = useWorkspace();
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceDescription, setNewWorkspaceDescription] = useState('');
  
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const handleCreateWorkspace = async () => {
    if (!newWorkspaceName.trim()) return;
    
    try {
      const workspace = await createWorkspace(newWorkspaceName, newWorkspaceDescription);
      setCurrentWorkspace(workspace);
      setCreateDialogOpen(false);
      setNewWorkspaceName('');
      setNewWorkspaceDescription('');
    } catch (error) {
      console.error('Failed to create workspace:', error);
    }
  };

  const handleEditClick = (workspace: Workspace) => {
    setEditingWorkspace(workspace);
    setEditName(workspace.name);
    setEditDescription(workspace.description || '');
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (workspace: Workspace) => {
    setEditingWorkspace(workspace);
    setDeleteDialogOpen(true);
  };

  const handleUpdateWorkspace = async () => {
    if (!editingWorkspace || !editName.trim()) return;
    
    try {
      await updateWorkspace(editingWorkspace.id, {
        name: editName,
        description: editDescription
      });
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Failed to update workspace:', error);
    }
  };

  const handleDeleteWorkspace = async () => {
    if (!editingWorkspace) return;
    
    try {
      await deleteWorkspace(editingWorkspace.id);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Failed to delete workspace:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Your Workspaces</h2>
        <Button onClick={() => setCreateDialogOpen(true)} className="gradient-button">
          <Plus className="mr-2 h-4 w-4" /> New Workspace
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workspaces.map((workspace) => (
          <Card 
            key={workspace.id} 
            className={`
              cursor-pointer transition-all hover:shadow-md
              ${workspace.id === currentWorkspace?.id ? 'border-primary' : 'border-border'}
            `}
            onClick={() => setCurrentWorkspace(workspace)}
          >
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-primary" />
                  <span className="truncate">{workspace.name}</span>
                  {workspace.isDefault && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                </CardTitle>
                {workspace.id === currentWorkspace?.id && (
                  <div className="mt-1 flex items-center text-sm text-primary">
                    <Check className="h-3 w-3 mr-1" />
                    Active
                  </div>
                )}
              </div>
              
              {!workspace.isDefault && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(workspace);
                    }}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(workspace);
                      }}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </CardHeader>
            
            <CardContent>
              <CardDescription className="min-h-[40px]">
                {workspace.description || 'No description provided'}
              </CardDescription>
            </CardContent>
            
            <CardFooter className="text-xs text-muted-foreground">
              Created {format(new Date(workspace.createdAt), 'MMM d, yyyy')}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Create Workspace Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Workspace</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="My Workspace"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Describe your workspace..."
                value={newWorkspaceDescription}
                onChange={(e) => setNewWorkspaceDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateWorkspace} 
              disabled={!newWorkspaceName.trim() || isLoading}
              className="gradient-button"
            >
              {isLoading ? 'Creating...' : 'Create Workspace'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Workspace Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Workspace</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                placeholder="Workspace Name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description (optional)</Label>
              <Textarea
                id="edit-description"
                placeholder="Describe your workspace..."
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateWorkspace}
              disabled={!editName.trim() || isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Workspace Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Workspace</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{editingWorkspace?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteWorkspace}
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete Workspace'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
