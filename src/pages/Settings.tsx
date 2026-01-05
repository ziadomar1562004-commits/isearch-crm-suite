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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useConfig } from '@/contexts/ConfigContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, X, Users, Tag, Home, UserPlus } from 'lucide-react';
import { Navigate } from 'react-router-dom';

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
    removeSalesRep,
    toggleSalesRepStatus,
  } = useConfig();
  const { toast } = useToast();

  const [newSource, setNewSource] = useState('');
  const [newType, setNewType] = useState('');
  const [isSalesDialogOpen, setIsSalesDialogOpen] = useState(false);
  const [salesForm, setSalesForm] = useState({
    name: '',
    email: '',
    phone: '+20 ',
  });

  // Only admins can access settings
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
    addSalesRep({
      name: salesForm.name,
      email: salesForm.email,
      phone: salesForm.phone,
      role: 'sales',
      isActive: true,
    });
    setIsSalesDialogOpen(false);
    setSalesForm({ name: '', email: '', phone: '+20 ' });
    toast({ title: 'Sales rep added' });
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
                Add Sales Rep
              </Button>
            </div>
            <CardDescription>
              Manage your sales team members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {salesReps.map((rep) => (
                <div
                  key={rep.id}
                  className="flex items-center justify-between rounded-lg border bg-card p-3"
                >
                  <div>
                    <p className="font-medium text-sm">{rep.name}</p>
                    <p className="text-xs text-muted-foreground">{rep.phone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={rep.isActive ? 'default' : 'secondary'}
                      className="cursor-pointer"
                      onClick={() => toggleSalesRepStatus(rep.id)}
                    >
                      {rep.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <button
                      onClick={() => removeSalesRep(rep.id)}
                      className="rounded p-1 hover:bg-destructive/10 text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Sales Rep Dialog */}
      <Dialog open={isSalesDialogOpen} onOpenChange={setIsSalesDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Sales Representative</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSalesRep} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={salesForm.name}
                onChange={(e) => setSalesForm({ ...salesForm, name: e.target.value })}
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
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsSalesDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Sales Rep</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
