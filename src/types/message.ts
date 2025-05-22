
export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read_status: boolean;
  replied_status: boolean;
  created_at: string;
  replied_at: string | null;
  admin_notes: string | null;
}
