import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Booking } from "@/types";

interface WeekViewProps {
  bookings?: Record<string, Booking[]>;
  onDateClick?: (date: Date) => void;
  onBookingClick?: (booking: Booking) => void;
}



export function WeekView({ bookings = {}, onDateClick, onBookingClick }: WeekViewProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const formatDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getWeekDays = () => {
    const startOfWeek = new Date(currentWeek);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + (direction === "next" ? 7 : -7));
    setCurrentWeek(newDate);
  };

  const weekDays = getWeekDays();
  const today = new Date();
  const weekDayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Semana de {weekDays[0].toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })} - {weekDays[6].toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
        </h2>

        <div className="flex items-center gap-2">
          <button
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300"
            onClick={() => navigateWeek("prev")}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300"
            onClick={() => setCurrentWeek(new Date())}
          >
            <CalendarIcon className="h-4 w-4" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300"
            onClick={() => navigateWeek("next")}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b dark:border-gray-700">
        {weekDays.map((date, index) => {
          const dateKey = formatDateKey(date);
          const dayBookings = bookings[dateKey] || [];
          const isToday = date.toDateString() === today.toDateString();

          return (
            <div
              key={index}
              className={cn(
                "border-r dark:border-gray-700 last:border-r-0",
                isToday && "bg-blue-50 dark:bg-blue-900/20"
              )}
            >
              <div className="p-3 border-b dark:border-gray-700">
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {weekDayNames[index]}
                  </div>
                  <div className={cn(
                    "text-lg font-semibold mt-1",
                    isToday ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-white"
                  )}>
                    {date.getDate()}
                  </div>
                </div>
              </div>

              <div 
                className="min-h-[300px] p-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
                onClick={() => onDateClick?.(date)}
              >
                <div className="space-y-1">
                  {dayBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className={cn(
                        "text-xs p-2 rounded cursor-pointer border-l-2",
                        booking.status === "pending" && "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400 text-yellow-800 dark:text-yellow-200",
                        booking.status === "approved" && "bg-green-50 dark:bg-green-900/20 border-green-400 text-green-800 dark:text-green-200",
                        booking.status === "rejected" && "bg-red-50 dark:bg-red-900/20 border-red-400 text-red-800 dark:text-red-200"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookingClick?.(booking);
                      }}
                    >
                      <div className="font-medium truncate">{booking.title}</div>
                      <div className="text-xs opacity-75">{booking.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}