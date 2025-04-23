
export const getCategoryDescription = (category: string): string => {
  switch (category) {
    case "Association Documents":
      return "Essential governing documents for our community";
    case "Community Guidelines":
      return "Important guidelines and forms for residents";
    case "Financial Documents":
      return "Budget and assessment information";
    case "Meeting Minutes":
      return "Records of board and community meetings";
    case "Newsletters":
      return "Community updates and announcements";
    case "Forms":
      return "Required forms for various community procedures";
    default:
      return "Important community documents";
  }
};
