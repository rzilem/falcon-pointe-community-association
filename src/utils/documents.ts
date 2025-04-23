
export const getCategoryDescription = (category: string): string => {
  switch (category) {
    case "Association Documents":
      return "Essential governing documents for our community";
    case "Community Guidelines":
      return "Important guidelines and forms for residents";
    case "Financial Documents":
      return "Budget and assessment information";
    default:
      return "";
  }
};
