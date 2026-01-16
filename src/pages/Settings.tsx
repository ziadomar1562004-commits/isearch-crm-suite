import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useConfig } from '@/contexts/ConfigContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, X, Users, Tag, Home, UserPlus, Edit, Ban, UserCheck } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { User } from '@/types/crm';

export default function Settings() {
  const { currentUser, isAdmin } = useAuth();
  const { 
    leadSources, 
    unitTypes, 
    salesReps,
    addLeadSource, 
    removeLeadSource,
    addUnitType,
    removeUnitType,
    addSalesRep,
    updateSalesRep,
    removeSalesRep,
    toggleSalesRepStatus,
  } = useConfig();
  const { toast } = useToast();

  const [newSource, setNewSource] = useState('');
  const [newType, setNewType] = useState('');
  const [isSalesDialogOpen, setIsSalesDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [selectedSalesRep, setSelectedSalesRep] = useState<User | null>(null);
  const [salesForm, setSalesForm] = useState({
    name: '',
    email: '',
    phone: '+20 ',
    password: '',
  });
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Only admins can access settings (sales cannot access)
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleAddSource = () => {
    if (newSource.trim()) {
      addLeadSource(newSource.trim());
      setNewSource('');
      toast({ title: 'Lead source added' });
    }
  };

  const handleAddType = () => {
    if (newType.trim()) {
      addUnitType(newType.trim());
      setNewType('');
      toast({ title: 'Unit type added' });
    }
  };

  const handleAddSalesRep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!salesForm.password || salesForm.password.length < 6) {
      toast({ title: 'Password must be at least 6 characters', variant: 'destructive' });
      return;
    }
    addSalesRep({
      name: salesForm.name,
      email: salesForm.email,
      phone: salesForm.phone,
      role: 'sales',
      isActive: true,
    });
    // Note: In a real app, you'd store the password securely in a backend
    setIsSalesDialogOpen(false);
    setSalesForm({ name: '', email: '', phone: '+20 ', password: '' });
    toast({ title: 'Sales account created successfully' });
  };

  const handleEditSalesRep = (rep: User) => {
    setSelectedSalesRep(rep);
    setEditForm({
      name: rep.name,
      email: rep.email,
      phone: rep.phone,
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSalesRep) {
      updateSalesRep(selectedSalesRep.id, {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
      });
      setIsEditDialogOpen(false);
      setSelectedSalesRep(null);
      toast({ title: 'Sales account updated' });
    }
  };

  const handleBanClick = (rep: User) => {
    setSelectedSalesRep(rep);
    setIsBanDialogOpen(true);
  };

  const handleConfirmBan = () => {
    if (selectedSalesRep) {
      toggleSalesRepStatus(selectedSalesRep.id);
      toast({ 
        title: selectedSalesRep.isActive ? 'Account banned' : 'Account restored',
        description: selectedSalesRep.isActive 
          ? `${selectedSalesRep.name} can no longer access the system`
          : `${selectedSalesRep.name} can now access the system`
      });
      setIsBanDialogOpen(false);
      setSelectedSalesRep(null);
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Settings"
        description="Configure your CRM options and manage team members"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Lead Sources */}
        <Card className="animate-fade-in">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Lead Sources</CardTitle>
            </div>
            <CardDescription>
              Manage where your leads come from
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input
                value={newSource}
                onChange={(e) => setNewSource(e.target.value)}
                placeholder="New source name"
                onKeyDown={(e) => e.key === 'Enter' && handleAddSource()}
              />
              <Button onClick={handleAddSource} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {leadSources.map((source) => (
                <Badge
                  key={source.id}
                  variant="secondary"
                  className="gap-1 pr-1"
                >
                  {source.label}
                  <button
                    onClick={() => removeLeadSource(source.id)}
                    className="ml-1 rounded-full p-0.5 hover:bg-destructive/20"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Unit Types */}
        <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Unit Types</CardTitle>
            </div>
            <CardDescription>
              Configure available property types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                placeholder="New unit type"
                onKeyDown={(e) => e.key === 'Enter' && handleAddType()}
              />
              <Button onClick={handleAddType} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {unitTypes.map((type) => (
                <Badge
                  key={type.id}
                  variant="secondary"
                  className="gap-1 pr-1"
                >
                  {type.label}
                  <button
                    onClick={() => removeUnitType(type.id)}
                    className="ml-1 rounded-full p-0.5 hover:bg-destructive/20"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sales Team */}
        <Card className="lg:col-span-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Sales Team</CardTitle>
              </div>
              <Button onClick={() => setIsSalesDialogOpen(true)} size="sm" className="gap-1">
                <UserPlus className="h-4 w-4" />
                Create Sales Account
              </Button>
            </div>
            <CardDescription>
              Create and manage sales accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {salesReps.map((rep) => (
                <div
                  key={rep.id}
                  className={`flex items-center justify-between rounded-lg border p-3 ${
                    !rep.isActive ? 'bg-muted/50 opacity-75' : 'bg-card'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{rep.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{rep.email}</p>
                    <p className="text-xs text-muted-foreground">{rep.phone}</p>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <Badge
                      variant={rep.isActive ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {rep.isActive ? 'Active' : 'Banned'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleEditSalesRep(rep)}
                      title="Edit account"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-7 w-7 ${rep.isActive ? 'text-destructive hover:text-destructive' : 'text-green-600 hover:text-green-600'}`}
                      onClick={() => handleBanClick(rep)}
                      title={rep.isActive ? 'Ban account' : 'Restore account'}
                    >
                      {rep.isActive ? <Ban className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => removeSalesRep(rep.id)}
                      title="Delete account"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Sales Account Dialog */}
      <Dialog open={isSalesDialogOpen} onOpenChange={setIsSalesDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Sales Account</DialogTitle>
            <DialogDescription>
              Create a new sales account. The user will use these credentials to log in.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSalesRep} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={salesForm.name}
                onChange={(e) => setSalesForm({ ...salesForm, name: e.target.value })}
                placeholder="Enter full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={salesForm.email}
                onChange={(e) => setSalesForm({ ...salesForm, email: e.target.value })}
                placeholder="sales@company.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={salesForm.phone}
                onChange={(e) => setSalesForm({ ...salesForm, phone: e.target.value })}
                placeholder="+20 1XX XXX XXXX"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={salesForm.password}
                onChange={(e) => setSalesForm({ ...salesForm, password: e.target.value })}
                placeholder="Min 6 characters"
                required
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsSalesDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Account</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Sales Account Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Sales Account</DialogTitle>
            <DialogDescription>
              Update the sales account information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                required
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Ban/Restore Confirmation Dialog */}
      <AlertDialog open={isBanDialogOpen} onOpenChange={setIsBanDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedSalesRep?.isActive ? 'Ban Account' : 'Restore Account'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedSalesRep?.isActive 
                ? `Are you sure you want to ban ${selectedSalesRep?.name}? They will no longer be able to log in to the system.`
                : `Are you sure you want to restore ${selectedSalesRep?.name}'s access? They will be able to log in again.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmBan}
              className={selectedSalesRep?.isActive ? 'bg-destructive hover:bg-destructive/90' : ''}
            >
              {selectedSalesRep?.isActive ? 'Ban Account' : 'Restore Account'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
