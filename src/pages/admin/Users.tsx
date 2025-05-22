
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNav from '@/components/admin/AdminNav';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

const Users = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [roleToChange, setRoleToChange] = useState('');
  const [updating, setUpdating] = useState(false);

  // Redirect non-admin users
  useEffect(() => {
    if (user && !isAdmin && !loading) {
      navigate('/admin');
    }
  }, [user, isAdmin, navigate, loading]);

  // Fetch users with their roles
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      
      try {
        // Get all users from auth.users
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
        
        if (authError) throw authError;
        
        // Get all profiles with roles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, role');
          
        if (profilesError) throw profilesError;
        
        // Map profiles to auth users
        const combinedUsers = authUsers.users.map(authUser => {
          const profile = profiles.find(p => p.id === authUser.id);
          return {
            id: authUser.id,
            email: authUser.email || '',
            role: profile?.role || 'user',
            created_at: authUser.created_at,
          };
        });
        
        setUsers(combinedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: 'Error',
          description: 'Failed to load users. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const handleRoleChange = (user: UserData, newRole: string) => {
    setSelectedUser(user);
    setRoleToChange(newRole);
    setDialogOpen(true);
  };

  const confirmRoleChange = async () => {
    if (!selectedUser) return;
    
    setUpdating(true);
    try {
      // Update user role in profiles table
      const { error } = await supabase
        .from('profiles')
        .update({ role: roleToChange })
        .eq('id', selectedUser.id);
        
      if (error) throw error;
      
      // Update local state
      setUsers(users.map(u => 
        u.id === selectedUser.id ? { ...u, role: roleToChange } : u
      ));
      
      toast({
        title: 'Role Updated',
        description: `${selectedUser.email}'s role has been changed to ${roleToChange}.`,
      });
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user role. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
      setDialogOpen(false);
    }
  };

  if (!user || !isAdmin) return null;
  
  return (
    <div>
      <AdminNav />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">User Management</h1>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Current Role</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(userData => (
                  <TableRow key={userData.id}>
                    <TableCell>{userData.email}</TableCell>
                    <TableCell>
                      <span className={`font-medium ${
                        userData.role === 'admin' ? 'text-blue-600' : 'text-gray-600'
                      }`}>
                        {userData.role}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(userData.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {userData.role === 'admin' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRoleChange(userData, 'user')}
                          className="text-blue-600"
                          disabled={userData.id === user.id}
                        >
                          Make User
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRoleChange(userData, 'admin')}
                          className="text-purple-600"
                        >
                          Make Admin
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {users.length === 0 && (
              <div className="text-center py-8">
                <p>No users found</p>
              </div>
            )}
          </div>
        )}
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change User Role</DialogTitle>
              <DialogDescription>
                Are you sure you want to change {selectedUser?.email}'s role to {roleToChange}?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={updating}>
                Cancel
              </Button>
              <Button onClick={confirmRoleChange} disabled={updating}>
                {updating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Confirm'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Users;
