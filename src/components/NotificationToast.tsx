import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Notification } from "@/hooks/useNotifications";

interface NotificationToastProps {
  notification: Notification;
  onClose: (id: string) => void;
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles = {
  success: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200",
  error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200",
  warning: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200",
  info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200",
};

export function NotificationToast({ notification, onClose }: NotificationToastProps) {
  const Icon = icons[notification.type];

  return (
    <div className={cn(
      "flex items-start gap-3 p-4 rounded-lg border shadow-lg max-w-sm animate-in slide-in-from-right-full",
      styles[notification.type]
    )}>
      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
      
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{notification.title}</p>
        {notification.message && (
          <p className="text-sm opacity-90 mt-1">{notification.message}</p>
        )}
      </div>
      
      <button
        onClick={() => onClose(notification.id)}
        className="flex-shrink-0 p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

interface NotificationContainerProps {
  notifications: Notification[];
  onClose: (id: string) => void;
}

export function NotificationContainer({ notifications, onClose }: NotificationContainerProps) {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onClose={onClose}
        />
      ))}
    </div>
  );
}