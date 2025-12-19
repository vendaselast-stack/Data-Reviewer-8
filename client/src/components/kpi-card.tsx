import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
    period: string;
  };
  iconBgColor?: string;
}

export function KPICard({ label, value, icon, trend, iconBgColor = "bg-blue-50 dark:bg-blue-950" }: KPICardProps) {
  return (
    <Card className="hover-elevate" data-testid={`card-kpi-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide" data-testid={`label-${label.toLowerCase()}`}>
              {label}
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight" data-testid={`value-${label.toLowerCase()}`}>
              {value}
            </p>
            {trend && (
              <div className="mt-3 flex items-center gap-1">
                <div className="flex items-center gap-1">
                  {trend.isPositive ? (
                    <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${trend.isPositive ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"}`}>
                    {trend.value}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">{trend.period}</span>
              </div>
            )}
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${iconBgColor}`} data-testid={`icon-${label.toLowerCase()}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
