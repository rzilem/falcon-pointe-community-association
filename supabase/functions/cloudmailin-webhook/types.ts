
export interface CloudmailinWebhook {
  envelope: {
    to: string;
    from: string;
    recipients: string[];
  };
  plain: string;
  html: string;
  subject: string;
  date: string;
  headers: Record<string, string>;
}

export interface AnnouncementData {
  section: string;
  title: string;
  content: string;
  section_type: "blog";
  category: "announcements";
  active: boolean;
  created_at: string;
  updated_at: string;
}
