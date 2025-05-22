
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNav from '@/components/admin/AdminNav';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Pencil, Trash, CalendarPlus } from 'lucide-react';
import EventForm from '@/components/admin/events/EventForm';
import { Event } from '@/hooks/useEvents';

const AdminEvents = () => {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() => {
    if (!isAdmin) {
      navigate('/auth', { replace: true });
    } else {
      fetchEvents();
    }
  }, [isAdmin, navigate]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        const eventsWithUrls = data.map(event => {
          let url = undefined;
          if (event.image_path) {
            url = supabase.storage
              .from('event-images')
              .getPublicUrl(event.image_path).data.publicUrl;
          }
          
          return { ...event, url };
        });
        
        setEvents(eventsWithUrls);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, imagePath?: string) => {
    try {
      // Delete the event from the database
      const { error: dbError } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
      
      if (dbError) throw dbError;
      
      // If there's an associated image, delete it from storage
      if (imagePath) {
        const { error: storageError } = await supabase.storage
          .from('event-images')
          .remove([imagePath]);
        
        if (storageError) {
          console.error('Storage error:', storageError);
        }
      }
      
      toast.success('Event deleted successfully');
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const handleEventSaved = () => {
    setIsDialogOpen(false);
    fetchEvents();
    setSelectedEvent(null);
  };

  return (
    <div>
      <AdminNav />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Event Management</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <CalendarPlus className="h-5 w-5" />
                Add New Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
                <DialogDescription>
                  Create a new community event that will be displayed on the calendar.
                </DialogDescription>
              </DialogHeader>
              <EventForm 
                userId={user?.id} 
                onSaved={handleEventSaved} 
              />
            </DialogContent>
          </Dialog>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : events.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CalendarPlus className="h-16 w-16 text-gray-400 mb-4" />
              <p className="text-xl font-medium mb-2">No Events Found</p>
              <p className="text-gray-500 mb-6">Get started by adding your first community event</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Add Your First Event</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Event</DialogTitle>
                  </DialogHeader>
                  <EventForm 
                    userId={user?.id} 
                    onSaved={handleEventSaved} 
                  />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {events.map(event => {
              const eventDate = new Date(event.date);
              const formattedDate = format(eventDate, "MMMM d, yyyy");
              
              return (
                <Card key={event.id}>
                  <CardHeader className="flex flex-row items-start justify-between space-y-0">
                    <div>
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      <CardDescription>
                        {formattedDate} • {event.time} • {event.location}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => setSelectedEvent(event)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit Event</DialogTitle>
                          </DialogHeader>
                          <EventForm 
                            userId={user?.id} 
                            event={selectedEvent}
                            onSaved={handleEventSaved} 
                          />
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleDelete(event.id, event.image_path)}
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-4">
                      {event.url && (
                        <div className="md:col-span-1">
                          <img 
                            src={event.url} 
                            alt={event.title} 
                            className="w-full h-32 object-cover rounded-md"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = "/placeholder.svg";
                            }} 
                          />
                        </div>
                      )}
                      <div className={`${event.url ? 'md:col-span-3' : 'md:col-span-4'}`}>
                        <p className="text-gray-700">{event.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEvents;
