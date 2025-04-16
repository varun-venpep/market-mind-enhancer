
import { CheckCircle2, Edit, Loader2, CircleDot } from "lucide-react";

interface StatusIconProps {
  status: string;
}

export const StatusIcon = ({ status }: StatusIconProps) => {
  switch(status) {
    case 'completed':
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case 'draft':
      return <Edit className="h-4 w-4" />;
    case 'in-progress':
      return <Loader2 className="h-4 w-4" />;
    default:
      return <CircleDot className="h-4 w-4" />;
  }
};
