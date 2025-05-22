
import React from 'react';
import { Message } from '@/types/message';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  onSelectMessage: (message: Message) => void;
  selectedMessageId?: string;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  isLoading, 
  onSelectMessage,
  selectedMessageId 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No messages found
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
      {messages.map((message) => (
        <div 
          key={message.id}
          onClick={() => onSelectMessage(message)}
          className={`
            p-3 rounded-md cursor-pointer transition-colors
            ${selectedMessageId === message.id 
              ? 'bg-primary/10 border-l-4 border-primary' 
              : 'hover:bg-gray-100 border-l-4 border-transparent'}
            ${!message.read_status ? 'bg-blue-50' : ''}
          `}
        >
          <div className="flex justify-between items-start mb-1">
            <h3 className={`font-medium truncate mr-2 ${!message.read_status ? 'font-bold' : ''}`}>
              {message.name}
            </h3>
            <div className="flex gap-1">
              {!message.read_status && (
                <Badge variant="default" className="text-xs">New</Badge>
              )}
              {message.replied_status && (
                <Badge variant="outline" className="text-xs">Replied</Badge>
              )}
            </div>
          </div>
          
          <p className="text-sm text-gray-600 truncate mb-1">{message.subject}</p>
          
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500 truncate">
              {message.email}
            </p>
            <p className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
