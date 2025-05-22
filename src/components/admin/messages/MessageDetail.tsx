
import React, { useState } from 'react';
import { Message } from '@/types/message';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Mail, X, MailCheck, 
  CornerUpLeft, Send, ExternalLink 
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface MessageDetailProps {
  message: Message;
  onClose: () => void;
  onStatusChange: (messageId: string, updates: Partial<Message>) => Promise<void>;
}

const MessageDetail: React.FC<MessageDetailProps> = ({ 
  message, 
  onClose,
  onStatusChange
}) => {
  const [adminNotes, setAdminNotes] = useState(message.admin_notes || '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const { toast } = useToast();

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    try {
      await onStatusChange(message.id, { admin_notes: adminNotes });
      toast({
        title: "Notes saved",
        description: "Admin notes have been saved successfully"
      });
    } catch (error) {
      toast({
        title: "Error saving notes",
        description: "There was a problem saving your notes",
        variant: "destructive"
      });
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleToggleRead = async () => {
    try {
      await onStatusChange(message.id, { read_status: !message.read_status });
    } catch (error) {
      toast({
        title: "Error updating status",
        description: "There was a problem updating the message status",
        variant: "destructive"
      });
    }
  };

  const handleToggleReplied = async () => {
    try {
      const updates: Partial<Message> = { 
        replied_status: !message.replied_status 
      };
      
      // If marking as replied, also set the replied_at timestamp
      if (!message.replied_status) {
        updates.replied_at = new Date().toISOString();
      } else {
        updates.replied_at = null;
      }
      
      await onStatusChange(message.id, updates);
    } catch (error) {
      toast({
        title: "Error updating status",
        description: "There was a problem updating the message status",
        variant: "destructive"
      });
    }
  };

  const handleComposeEmail = () => {
    const subject = `Re: ${message.subject}`;
    const mailtoUrl = `mailto:${message.email}?subject=${encodeURIComponent(subject)}`;
    window.open(mailtoUrl, '_blank');
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Message Details
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">From</h3>
            <p className="font-medium">{message.name}</p>
            <p className="text-blue-600">{message.email}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Received</h3>
            <p>{format(new Date(message.created_at), 'PPP')}</p>
            <p className="text-gray-500 text-sm">
              {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">Subject</h3>
          <p className="font-medium">{message.subject}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">Message</h3>
          <div className="bg-gray-50 p-4 rounded-md mt-1 whitespace-pre-wrap">
            {message.message}
          </div>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="read-status" 
                checked={message.read_status}
                onCheckedChange={handleToggleRead}
              />
              <Label htmlFor="read-status">Mark as read</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="replied-status" 
                checked={message.replied_status}
                onCheckedChange={handleToggleReplied}
              />
              <Label htmlFor="replied-status">Mark as replied</Label>
            </div>
          </div>
          
          {message.replied_status && message.replied_at && (
            <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
              <MailCheck className="h-4 w-4" />
              <span>
                Replied {formatDistanceToNow(new Date(message.replied_at), { addSuffix: true })}
              </span>
            </div>
          )}
          
          <h3 className="text-sm font-medium text-gray-500 mb-2">Admin Notes</h3>
          <Textarea 
            placeholder="Add notes about this message..." 
            className="h-24"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
          />
          <div className="flex justify-end mt-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleSaveNotes} 
              disabled={isSavingNotes}
            >
              {isSavingNotes ? "Saving..." : "Save Notes"}
            </Button>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <CornerUpLeft className="h-4 w-4 mr-2" />
              Quick Reply
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Quick Reply Templates</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 mt-4">
              <p className="text-sm text-gray-500">
                Choose a reply template to use when responding to this message:
              </p>
              <div className="space-y-2 mt-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={handleComposeEmail}
                >
                  Thank you for your message. We've received it and will respond shortly.
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleComposeEmail}
                >
                  Your request has been forwarded to the appropriate department.
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleComposeEmail}
                >
                  We're working on your request and will get back to you within 2 business days.
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        <Button onClick={handleComposeEmail}>
          <Send className="h-4 w-4 mr-2" />
          Compose Reply
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MessageDetail;
