import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Booking, BookingStatus } from "@/types";

export interface CalendarDay {
  date: Date;
  bookings: Booking[];
  isCurrentMonth: boolean;
  isToday: boolean;
}

interface CalendarSchedulerProps {
  bookings?: Record<string, Booking[]>;
  onDateClick?: (date: Date) => void;
  onBookingClick?: (booking: Booking) => void;
}

const statusColors = {
  pending: "bg-yellow-500",
  approved: "bg-green-500",
  rejected: "bg-red-500",
};

const statusLabels = {
  pending: "Aguardando",
  approved: "Aprovado",
  rejected: "Reprovado",
};

export function CalendarScheduler({
  bookings = {},
  onDateClick,
  onBookingClick,
}: CalendarSchedulerProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const formatDateKey = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const getCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: CalendarDay[] = [];
    const today = new Date();

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const dateKey = formatDateKey(date);
      const dayBookings = bookings[dateKey] || [];

      days.push({
        date,
        bookings: dayBookings,
        isCurrentMonth: date.getMonth() === month,
        isToday: date.toDateString() === today.toDateString(),
      });
    }

    return days;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1));
    setCurrentDate(newDate);
  };

  const getStatusCounts = (bookings: Booking[]) => {
    return bookings.reduce((acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    }, {} as Record<BookingStatus, number>);
  };

  const calendarDays = getCalendarDays();
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">
          {currentDate.toLocaleDateString("pt-BR", {
            month: "long",
            year: "numeric",
          })}
        </h2>

        <div className="flex items-center gap-2">
          <button
            className="p-2 hover:bg-gray-100 rounded-md"
            onClick={() => navigateMonth("prev")}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-md"
            onClick={() => setCurrentDate(new Date())}
          >
            <CalendarIcon className="h-4 w-4" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-md"
            onClick={() => navigateMonth("next")}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-2 text-center text-sm font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const statusCounts = getStatusCounts(day.bookings);
            const totalBookings = day.bookings.length;

            return (
              <div
                key={index}
                className={cn(
                  "min-h-[80px] p-2 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors",
                  !day.isCurrentMonth && "text-gray-400 bg-gray-50",
                  day.isToday && "bg-blue-50 border-blue-200"
                )}
                onClick={() => onDateClick?.(day.date)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      day.isToday && "text-blue-600"
                    )}
                  >
                    {day.date.getDate()}
                  </span>

                  {totalBookings > 0 && (
                    <span className="text-xs px-1.5 py-0.5 bg-gray-200 rounded">
                      {totalBookings}
                    </span>
                  )}
                </div>

                {totalBookings > 0 && (
                  <div className="space-y-1">
                    {Object.entries(statusCounts).map(([status, count]) => (
                      <div key={status} className="flex items-center gap-1">
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full",
                            statusColors[status as BookingStatus]
                          )}
                        />
                        <span className="text-xs text-gray-600">{count}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-1 space-y-1">
                  {day.bookings.slice(0, 2).map((booking) => (
                    <div
                      key={booking.id}
                      className={cn(
                        "text-xs p-1 rounded cursor-pointer truncate",
                        booking.status === "pending" &&
                          "bg-yellow-100 text-yellow-800",
                        booking.status === "approved" &&
                          "bg-green-100 text-green-800",
                        booking.status === "rejected" &&
                          "bg-red-100 text-red-800"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookingClick?.(booking);
                      }}
                      title={`${booking.title} - ${booking.time} (${
                        statusLabels[booking.status]
                      })`}
                    >
                      {booking.time} {booking.title}
                    </div>
                  ))}
                  {totalBookings > 2 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{totalBookings - 2} mais
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 p-4 border-t bg-gray-50">
        {Object.entries(statusLabels).map(([status, label]) => (
          <div key={status} className="flex items-center gap-2">
            <div
              className={cn(
                "w-3 h-3 rounded-full",
                statusColors[status as BookingStatus]
              )}
            />
            <span className="text-sm text-gray-600">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
