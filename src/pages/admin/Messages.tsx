
import React, { useState } from 'react';
import AdminNav from '@/components/admin/AdminNav';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MessageList from '@/components/admin/messages/MessageList';
import MessageDetail from '@/components/admin/messages/MessageDetail';
import { useMessages } from '@/hooks/useMessages';
import { Message } from '@/types/message';

const Messages = () => {
  const { isAdmin } = useAuth();
  const { messages, isLoading, error, refreshMessages, updateMessageStatus } = useMessages();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  if (!isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  const handleSelectMessage = async (message: Message) => {
    setSelectedMessage(message);
    
    // Mark as read when selected if not already read
    if (!message.read_status) {
      await updateMessageStatus(message.id, { read_status: true });
      refreshMessages();
    }
  };

  const handleCloseDetail = () => {
    setSelectedMessage(null);
  };

  const handleStatusChange = async (messageId: string, updates: Partial<Message>) => {
    await updateMessageStatus(messageId, updates);
    refreshMessages();
    
    // Update selected message if it's the one being updated
    if (selectedMessage && selectedMessage.id === messageId) {
      setSelectedMessage(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  return (
    <div>
      <AdminNav />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Messages</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Error loading messages: {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Recent Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <MessageList 
                  messages={messages} 
                  isLoading={isLoading} 
                  onSelectMessage={handleSelectMessage}
                  selectedMessageId={selectedMessage?.id}
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <MessageDetail 
                message={selectedMessage} 
                onClose={handleCloseDetail}
                onStatusChange={handleStatusChange}
              />
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center py-20">
                  <p className="text-gray-500">Select a message to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
