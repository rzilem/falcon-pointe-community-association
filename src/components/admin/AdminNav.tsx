
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Image, FileText } from 'lucide-react';

const AdminNav = () => {
  const { signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex space-x-4">
          <Link to="/admin">
            <Button 
              variant={isActive('/admin') ? 'secondary' : 'ghost'}
              className="text-white"
            >
              Dashboard
            </Button>
          </Link>
          <Link to="/admin/images">
            <Button 
              variant={isActive('/admin/images') ? 'secondary' : 'ghost'}
              className="text-white flex items-center"
            >
              <Image className="mr-2 h-4 w-4" />
              Images
            </Button>
          </Link>
          <Link to="/admin/content">
            <Button 
              variant={isActive('/admin/content') ? 'secondary' : 'ghost'}
              className="text-white flex items-center"
            >
              <FileText className="mr-2 h-4 w-4" />
              Content
            </Button>
          </Link>
          <Link to="/admin/documents">
            <Button 
              variant={isActive('/admin/documents') ? 'secondary' : 'ghost'}
              className="text-white"
            >
              Documents
            </Button>
          </Link>
        </div>
        <Button variant="destructive" onClick={signOut}>
          Sign Out
        </Button>
      </div>
    </nav>
  );
};

export default AdminNav;
