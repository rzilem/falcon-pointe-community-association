
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ManagementCardProps {
  title: string;
  description: string;
  content: string;
  link: string;
}

const ManagementCard: React.FC<ManagementCardProps> = ({ 
  title, 
  description, 
  content, 
  link 
}) => {
  return (
    <Link to={link}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            {content}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ManagementCard;
