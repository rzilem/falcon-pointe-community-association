import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNav from '@/components/admin/AdminNav';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, parseISO } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EventForm from '@/components/admin/events/EventForm';
import { Calendar, Edit, Trash2, Filter } from 'lucide-react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useConfirmation } from '@/hooks/useConfirmation';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  location: string;
  image_path: string | null;
  is_featured: boolean;
  category: string | null;
  created_at: string;
}

const Events = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  
  const {
    isConfirmationOpen,
    openConfirmation,
    closeConfirmation,
    handleConfirmAction,
    confirmationTitle,
    confirmationDescription,
    confirmationVariant,
    confirmationButtonLabel,
    cancelButtonLabel
  } = useConfirmation();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/auth', { replace: true });
    } else {
      fetchEvents();
    }
  }, [isAdmin, navigate, filterCategory, sortField, sortOrder]);

  const fetchEvents = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('events')
        .select('*');

      if (filterCategory !== 'all') {
        query = query.eq('category', filterCategory);
      }

      const { data, error } = await query
        .order(sortField, { ascending: sortOrder === 'asc' });

      if (error) throw error;

      let filteredData = data || [];
      
      if (searchQuery) {
        filteredData = filteredData.filter(event => 
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setEvents(filteredData);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    openConfirmation({
      itemId: id,
      title: "Delete Event",
      description: "Are you sure you want to delete this event? This action cannot be undone.",
      variant: "delete",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      onConfirm: async (eventId) => {
        try {
          const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', eventId);

          if (error) throw error;

          toast.success('Event deleted successfully');
          fetchEvents();
        } catch (error) {
          console.error('Error deleting event:', error);
          toast.error('Failed to delete event');
        }
      }
    });
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
  };

  const handleSortChange = (field: string) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  const categories = [
    'all',
    'community',
    'holiday',
    'social',
    'meeting',
    'sport',
    'other'
  ];

  return (
    <div>
      <AdminNav />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Events Management</h1>

        <Tabs defaultValue={editingEvent ? "edit" : "list"}>
          <TabsList className="mb-8">
            <TabsTrigger value="list" onClick={() => setEditingEvent(null)}>
              Event List
            </TabsTrigger>
            <TabsTrigger value="create" onClick={() => setEditingEvent(null)}>
              Create Event
            </TabsTrigger>
            {editingEvent && (
              <TabsTrigger value="edit">Edit Event</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle>All Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-4 items-end">
                    <div className="w-full sm:w-1/3">
                      <Label htmlFor="search">Search</Label>
                      <Input
                        id="search"
                        placeholder="Search events..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="category-filter">Filter by Category</Label>
                      <select
                        id="category-filter"
                        className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery('');
                        setFilterCategory('all');
                        setSortField('date');
                        setSortOrder('desc');
                        fetchEvents();
                      }}
                    >
                      Reset Filters
                    </Button>
                    <Button 
                      variant="default" 
                      onClick={fetchEvents}
                    >
                      Apply Filters
                    </Button>
                  </div>

                  {loading ? (
                    <p className="text-center py-4">Loading events...</p>
                  ) : events.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-lg text-gray-500 mb-4">No events found</p>
                      <Button onClick={() => document.querySelector('[value="create"]')?.dispatchEvent(new Event('click'))}>
                        Create New Event
                      </Button>
                    </div>
                  ) : (
                    <div className="rounded-md border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead 
                              className="cursor-pointer"
                              onClick={() => handleSortChange('title')}
                            >
                              Title {sortField === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </TableHead>
                            <TableHead 
                              className="cursor-pointer"
                              onClick={() => handleSortChange('date')}
                            >
                              Date {sortField === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Featured</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {events.map((event) => (
                            <TableRow key={event.id}>
                              <TableCell className="font-medium">{event.title}</TableCell>
                              <TableCell>{formatDate(event.date)}</TableCell>
                              <TableCell>{event.time}</TableCell>
                              <TableCell>{event.location}</TableCell>
                              <TableCell>
                                <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                                  {event.category || 'general'}
                                </span>
                              </TableCell>
                              <TableCell>
                                {event.is_featured ? (
                                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                    Featured
                                  </span>
                                ) : (
                                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                                    Standard
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleEditEvent(event)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => handleDeleteEvent(event.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create">
            <EventForm onSuccess={() => {
              fetchEvents();
              document.querySelector('[value="list"]')?.dispatchEvent(new Event('click'));
            }} />
          </TabsContent>

          <TabsContent value="edit">
            {editingEvent && (
              <EventForm 
                event={editingEvent} 
                onSuccess={() => {
                  fetchEvents();
                  setEditingEvent(null);
                  document.querySelector('[value="list"]')?.dispatchEvent(new Event('click'));
                }} 
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <ConfirmationDialog
        isOpen={isConfirmationOpen}
        onClose={closeConfirmation}
        onConfirm={handleConfirmAction}
        title={confirmationTitle}
        description={confirmationDescription}
        confirmLabel={confirmationButtonLabel}
        cancelLabel={cancelButtonLabel}
        variant={confirmationVariant}
      />
    </div>
  );
};

export default Events;
