import { Badge } from "@/lib/shadcn/components/ui";
import { Shield, Circle } from "lucide-react";

type DataMap = Record<string, { className?: string; label?: string }>;

export const UserBadge = ({
  type,
  status,
  typeData,
  statusData,
}: Readonly<{
  type: string;
  status: string;
  typeData: DataMap;
  statusData: DataMap;
}>) => {
  return (
    <div className="flex items-center gap-2">
      <Badge className={typeData[type]?.className}>
        <Shield className="w-3 h-3 mr-1" />
        {typeData[type]?.label ?? type}
      </Badge>
      <Badge className={statusData[status]?.className}>
        <Circle className="w-3 h-3 mr-1" />
        {statusData[status]?.label ?? status}
      </Badge>
    </div>
  );
};

export type UserBadgeProps = Readonly<{
  type: string;
  status: string;
  typeData: DataMap;
  statusData: DataMap;
}>;

// Backwards-compatible alias
export const TypeBadge = (props: UserBadgeProps) => <UserBadge {...props} />;