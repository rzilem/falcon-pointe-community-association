
import React from 'react';

interface AdminPanelProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ title, children, className = "" }) => {
  return (
    <div className={`border rounded-md p-6 ${className}`}>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
};

export default AdminPanel;
