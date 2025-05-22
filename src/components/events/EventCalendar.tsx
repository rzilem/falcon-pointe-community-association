
import React, { useState } from "react";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { useEvents } from "@/hooks/useEvents";
import { format, isSameDay } from "date-fns";

interface EventCalendarProps {
  onDateSelect?: (date: Date) => void;
}

const EventCalendar: React.FC<EventCalendarProps> = ({ onDateSelect }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { events, isLoading } = useEvents({ futureOnly: true });

  // Create a map of dates with events for highlighting
  const eventDates = events.reduce((acc, event) => {
    const eventDate = new Date(event.date);
    const dateKey = format(eventDate, "yyyy-MM-dd");
    
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, any[]>);

  // Custom event rendering for calendar
  const handleDayRender = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const hasEvents = eventDates[dateStr] && eventDates[dateStr].length > 0;
    
    return hasEvents ? (
      <div className="relative h-full w-full">
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full"></div>
      </div>
    ) : null;
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate && onDateSelect) {
      onDateSelect(newDate);
    }
  };

  // Get events for the selected date
  const selectedDateEvents = date 
    ? events.filter(event => isSameDay(new Date(event.date), date))
    : [];

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <Card>
          <CardContent className="p-4">
            <CalendarUI
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              className="rounded-md border"
              components={{
                DayContent: ({ date }) => (
                  <>
                    <span>{date.getDate()}</span>
                    {handleDayRender(date)}
                  </>
                ),
              }}
            />
          </CardContent>
        </Card>
      </div>
      
      <div>
        <Card className="h-full">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">
              {date ? format(date, "MMMM d, yyyy") : "Select a date"}
            </h3>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : selectedDateEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedDateEvents.map(event => (
                  <div key={event.id} className="border-l-4 border-primary pl-3 py-2">
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-gray-500">{event.time}</p>
                    <p className="text-sm text-gray-500">{event.location}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 py-8 text-center">No events scheduled for this date</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventCalendar;
