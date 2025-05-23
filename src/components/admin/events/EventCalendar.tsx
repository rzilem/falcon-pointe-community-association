
import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format, parseISO, isValid, isSameDay, startOfMonth, endOfMonth } from 'date-fns';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string | null;
  is_featured: boolean;
}

interface EventCalendarProps {
  events: Event[];
  onEditEvent?: (event: Event) => void;
  onDeleteEvent?: (id: string) => void;
}

const EventCalendar: React.FC<EventCalendarProps> = ({ events, onEditEvent, onDeleteEvent }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Convert event dates to JavaScript Date objects
  const eventDates = events.map(event => {
    const eventDate = parseISO(event.date);
    return isValid(eventDate) ? eventDate : null;
  }).filter(Boolean) as Date[];

  // Filter events for the selected date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = parseISO(event.date);
      return isValid(eventDate) && isSameDay(eventDate, date);
    });
  };

  const selectedDateEvents = date ? getEventsForDate(date) : [];

  // Get events for current month view (for later feature of highlighting dates with events)
  const getEventsInCurrentMonth = () => {
    if (!date) return [];
    
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    
    return events.filter(event => {
      const eventDate = parseISO(event.date);
      return isValid(eventDate) && eventDate >= start && eventDate <= end;
    });
  };

  const currentMonthEvents = getEventsInCurrentMonth();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Calendar</CardTitle>
            <CalendarIcon className="h-5 w-5 text-gray-500" />
          </div>
          <CardDescription>Select a date to view events</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate as any}
            className="rounded-md border"
            disabled={{ before: new Date(2000, 0, 1) }}
            modifiers={{
              hasEvent: eventDates,
            }}
            modifiersStyles={{
              hasEvent: { 
                fontWeight: 'bold',
                backgroundColor: 'rgba(59, 130, 246, 0.1)' 
              }
            }}
            footer={
              <div className="text-center text-sm mt-2">
                {currentMonthEvents.length} events this month
              </div>
            }
          />
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Events for {date ? format(date, 'MMMM d, yyyy') : 'Selected Date'}
            </CardTitle>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const prev = new Date(date);
                  prev.setDate(date.getDate() - 1);
                  setDate(prev);
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const next = new Date(date);
                  next.setDate(date.getDate() + 1);
                  setDate(next);
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>
            {selectedDateEvents.length === 0 
              ? 'No events scheduled for this date' 
              : `${selectedDateEvents.length} event${selectedDateEvents.length > 1 ? 's' : ''} scheduled`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedDateEvents.length === 0 ? (
            <div className="py-8 text-center border border-dashed rounded-md">
              <p className="text-gray-500">No events found for this date</p>
              <Button variant="link" className="mt-2">
                Schedule a new event
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedDateEvents.map(event => (
                <div 
                  key={event.id} 
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{event.title}</h3>
                      <p className="text-sm text-gray-500">{event.time} • {event.location}</p>
                      {event.category && (
                        <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-100 rounded-full">
                          {event.category}
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {onEditEvent && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditEvent(event);
                          }}
                        >
                          Edit
                        </Button>
                      )}
                      {onDeleteEvent && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteEvent(event.id);
                          }}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Event Details Modal (could be implemented later) */}
    </div>
  );
};

export default EventCalendar;
