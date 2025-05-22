
import React from 'react';
import ManagementCard from './ManagementCard';

const ManagementSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ManagementCard
        title="Image Management"
        description="Manage site images and media content"
        content="Upload, replace, and organize images across the website. Add, edit, or delete images used on various pages."
        link="/admin/images"
      />
      
      <ManagementCard
        title="Content Management"
        description="Update site content and information"
        content="Edit text content, announcements, and site information. Manage descriptions, rules, and other important text."
        link="/admin/content"
      />
      
      <ManagementCard
        title="Document Management"
        description="Manage association documents and forms"
        content="Upload and organize important documents like bylaws, forms, meeting minutes, and community guidelines."
        link="/admin/documents"
      />

      <ManagementCard
        title="Message Management"
        description="Manage contact form submissions"
        content="View and respond to messages from the contact form. Track message history, add notes, and manage responses."
        link="/admin/messages"
      />
    </div>
  );
};

export default ManagementSection;
