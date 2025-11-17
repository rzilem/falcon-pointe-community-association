
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash, Loader2, Bot, Upload } from 'lucide-react';
import { SiteContent } from '@/types/content';
import ContentPreview from './ContentPreview';
import { formatDate } from '@/utils/contentFormatting';

interface BlogPostsTableProps {
  posts: SiteContent[];
  sortField: string;
  sortDirection: 'asc' | 'desc';
  deleting?: string | null;
  onSortChange: (field: string) => void;
  onEdit: (post: SiteContent) => void;
  onDelete: (id: string) => void;
}

const BlogPostsTable: React.FC<BlogPostsTableProps> = ({
  posts,
  sortField,
  sortDirection,
  deleting,
  onSortChange,
  onEdit,
  onDelete
}) => {
  const getSortIcon = (field: string) => {
    if (sortField === field) {
      return sortDirection === 'asc' ? '↑' : '↓';
    }
    return '';
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead 
            className="cursor-pointer"
            onClick={() => onSortChange('title')}
          >
            Title {getSortIcon('title')}
          </TableHead>
          <TableHead 
            className="cursor-pointer"
            onClick={() => onSortChange('category')}
          >
            Category {getSortIcon('category')}
          </TableHead>
          <TableHead>Image Type</TableHead>
          <TableHead 
            className="cursor-pointer"
            onClick={() => onSortChange('updated_at')}
          >
            Last Updated {getSortIcon('updated_at')}
          </TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id} className={deleting === post.id ? 'opacity-50' : ''}>
            <TableCell className="font-medium">{post.title || 'Untitled'}</TableCell>
            <TableCell>{post.category || 'Uncategorized'}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {post.use_ai_image_generation !== false ? (
                  <>
                    <Bot className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">AI</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Manual</span>
                  </>
                )}
              </div>
            </TableCell>
            <TableCell>{formatDate(post.updated_at)}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 text-xs rounded-full ${post.active ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {post.active ? 'Published' : 'Draft'}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <ContentPreview content={post} />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEdit(post)}
                  disabled={deleting === post.id}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => onDelete(post.id)}
                  disabled={deleting === post.id}
                >
                  {deleting === post.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BlogPostsTable;
