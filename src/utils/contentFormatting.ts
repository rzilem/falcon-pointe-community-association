
import { format } from 'date-fns';

export const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  } catch {
    return 'Unknown date';
  }
};

export const formatStatus = (active: boolean) => {
  return active ? 'Published' : 'Draft';
};

export const getStatusClass = (active: boolean) => {
  return active 
    ? 'bg-green-100 text-green-800' 
    : 'bg-yellow-100 text-yellow-800';
};
