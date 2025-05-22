
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Image, FileText, Calendar, LayoutDashboard, File } from 'lucide-react';

const AdminNav = () => {
  const { signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex space-x-4 overflow-x-auto pb-2">
          <Link to="/admin">
            <Button 
              variant={isActive('/admin') ? 'secondary' : 'ghost'}
              className="text-white flex items-center gap-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link to="/admin/events">
            <Button 
              variant={isActive('/admin/events') ? 'secondary' : 'ghost'}
              className="text-white flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Events
            </Button>
          </Link>
          <Link to="/admin/images">
            <Button 
              variant={isActive('/admin/images') ? 'secondary' : 'ghost'}
              className="text-white flex items-center gap-2"
            >
              <Image className="h-4 w-4" />
              Images
            </Button>
          </Link>
          <Link to="/admin/content">
            <Button 
              variant={isActive('/admin/content') ? 'secondary' : 'ghost'}
              className="text-white flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Content
            </Button>
          </Link>
          <Link to="/admin/documents">
            <Button 
              variant={isActive('/admin/documents') ? 'secondary' : 'ghost'}
              className="text-white flex items-center gap-2"
            >
              <File className="h-4 w-4" />
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
