import React from "react";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

interface GatedCommunityBadgeProps {
  className?: string;
}

const GatedCommunityBadge: React.FC<GatedCommunityBadgeProps> = ({ className }) => {
  return (
    <Badge variant="secondary" className={`inline-flex items-center gap-1 ${className}`}>
      <Shield className="h-3 w-3" aria-hidden="true" />
      <span>Gated Community</span>
    </Badge>
  );
};

export default GatedCommunityBadge;