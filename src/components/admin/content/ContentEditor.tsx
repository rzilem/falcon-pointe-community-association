
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { SiteContent } from '@/types/content';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';

interface ContentEditorProps {
  content: SiteContent;
  onUpdate: (id: string, updatedData: Partial<SiteContent>) => void;
  onDelete: (id: string) => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({ content, onUpdate, onDelete }) => {
  const [title, setTitle] = useState(content.title || '');
  const [contentText, setContentText] = useState(content.content || '');
  const [active, setActive] = useState(content.active);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      await onUpdate(content.id, {
        title: title || null,
        content: contentText || null,
        active,
        // Make sure to preserve the section_type
        section_type: content.section_type
      });
      setEditing(false);
    } catch (error) {
      console.error('Error saving content:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!editing) {
    return (
      <div className="border rounded-md p-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-lg font-medium">{content.title || 'Untitled'}</h4>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setEditing(true)}
            >
              Edit
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => onDelete(content.id)}
            >
              Delete
            </Button>
          </div>
        </div>
        <p className="text-gray-600 whitespace-pre-wrap">{content.content}</p>
        <div className="mt-2 text-sm text-gray-500 flex flex-wrap gap-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>Updated: {format(new Date(content.updated_at), 'MMM d, yyyy')}</span>
          </div>
          <div>
            <span className={`px-2 py-1 text-xs rounded-full ${content.active ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {content.active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-md p-4">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor={`title-${content.id}`}>Title</Label>
          <Input 
            id={`title-${content.id}`} 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor={`content-${content.id}`}>Content</Label>
          <Textarea 
            id={`content-${content.id}`} 
            value={contentText} 
            onChange={(e) => setContentText(e.target.value)} 
            className="min-h-[150px]"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id={`active-${content.id}`}
            checked={active}
            onCheckedChange={setActive}
          />
          <Label htmlFor={`active-${content.id}`}>Active</Label>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setEditing(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContentEditor;
