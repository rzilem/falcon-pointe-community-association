import { supabase } from "@/integrations/supabase/client";

const documents = [
  {
    name: "Articles of Incorporation",
    type: "PDF",
    url: "https://townsq-production-resident-files.s3.amazonaws.com/uploads/ibvzw0eg8j92/community_document/file/213315/Articles_of_Incorporation.pdf",
    category: "Association Documents",
    description: "Legal document establishing the association as a corporation",
    last_updated: "2024-01-15"
  },
  {
    name: "Bylaws",
    type: "PDF",
    url: "https://townsq-production-resident-files.s3.amazonaws.com/uploads/ibvzw0eg8j92/community_document/file/213316/Bylaws.pdf",
    category: "Association Documents",
    description: "Rules governing the operation of the association",
    last_updated: "2024-02-01"
  },
  {
    name: "CCRs",
    type: "PDF",
    url: "https://townsq-production-resident-files.s3.amazonaws.com/uploads/ibvzw0eg8j92/community_document/file/213317/CCRs.pdf",
    category: "Association Documents",
    description: "Covenants, conditions, and restrictions for the community",
    last_updated: "2024-02-15"
  },
  {
    name: "ACC Guidelines",
    type: "PDF",
    url: "https://townsq-production-resident-files.s3.amazonaws.com/uploads/ibvzw0eg8j92/community_document/file/213318/ACC_Guidelines.pdf",
    category: "Community Guidelines",
    description: "Architectural Control Committee guidelines for home modifications",
    last_updated: "2024-03-10"
  },
  {
    name: "Gate Access Form",
    type: "PDF",
    url: "https://townsq-production-resident-files.s3.amazonaws.com/uploads/ibvzw0eg8j92/community_document/file/213319/Gate_Access_Form.pdf",
    category: "Community Guidelines",
    description: "Form to request gate access for visitors and service providers",
    last_updated: "2024-03-15"
  },
  {
    name: "Pool Rules",
    type: "PDF",
    url: "https://townsq-production-resident-files.s3.amazonaws.com/uploads/ibvzw0eg8j92/community_document/file/213320/Pool_Rules.pdf",
    category: "Community Guidelines",
    description: "Rules and regulations for community pool usage",
    last_updated: "2024-03-20"
  },
  {
    name: "2024 Budget",
    type: "PDF",
    url: "https://townsq-production-resident-files.s3.amazonaws.com/uploads/ibvzw0eg8j92/community_document/file/213321/2024_Budget.pdf",
    category: "Financial Documents",
    description: "Annual budget for the current fiscal year",
    last_updated: "2024-01-05"
  },
  {
    name: "Assessment Information",
    type: "PDF",
    url: "https://townsq-production-resident-files.s3.amazonaws.com/uploads/ibvzw0eg8j92/community_document/file/213322/Assessment_Information.pdf",
    category: "Financial Documents",
    description: "Information about HOA dues and payment schedules",
    last_updated: "2024-01-10"
  }
];

export const importInitialDocuments = async () => {
  const { error } = await supabase
    .from('documents')
    .upsert(documents);

  if (error) {
    console.error('Error importing documents:', error);
    return false;
  }
  
  return true;
};
