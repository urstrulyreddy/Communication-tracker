import { LucideIcon } from 'lucide-react';
import { cn } from '../utils/cn';

interface QuickActionCardProps {
  title: string;
  count: number;
  icon: LucideIcon;
  className?: string;
}

export function QuickActionCard({ title, count, icon: Icon, className }: QuickActionCardProps) {
  return (
    <div className={cn("p-6 rounded-lg", className)}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className="h-8 w-8 text-gray-600" />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd>
              <div className="text-lg font-medium text-gray-900">{count}</div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );
} 