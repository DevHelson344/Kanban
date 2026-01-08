import { useState, useMemo } from "react";
import type { Booking, BookingStatus, Task } from "@/types";

export interface UseCalendarDataProps {
  initialBookings?: Record<string, Booking[]>;
  tasks?: Task[];
}

export function useCalendarData({
  initialBookings = {},
  tasks = [],
}: UseCalendarDataProps = {}) {
  const [bookings, setBookings] = useState<Record<string, Booking[]>>(initialBookings);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const formatDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Combinar bookings manuais com tarefas que têm data de vencimento
  const allBookings = useMemo(() => {
    const combined: Record<string, Booking[]> = {};
    
    tasks.forEach(task => {
      if (task.dueDate) {
        const dateKey = task.dueDate;
        const taskBooking: Booking = {
          id: `task-${task.id}`,
          title: task.title,
          status: task.status === "done" ? "approved" : task.status === "doing" ? "pending" : "pending",
          time: "Todo o dia",
          taskId: task.id,
        };
        
        if (!combined[dateKey]) {
          combined[dateKey] = [];
        }
        
        combined[dateKey].push(taskBooking);
      }
    });
    
    // Adicionar bookings manuais
    Object.entries(bookings).forEach(([dateKey, dayBookings]) => {
      if (!combined[dateKey]) {
        combined[dateKey] = [];
      }
      combined[dateKey].push(...dayBookings.filter(b => !b.taskId));
    });
    
    return combined;
  }, [bookings, tasks]);

  const addBooking = (date: Date, booking: Omit<Booking, "id">) => {
    const dateKey = formatDateKey(date);
    const newBooking: Booking = {
      ...booking,
      id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    setBookings((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newBooking],
    }));

    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
    setBookings((prev) => {
      const updated = { ...prev };
      for (const dateKey in updated) {
        updated[dateKey] = updated[dateKey].map((booking) =>
          booking.id === bookingId ? { ...booking, status } : booking
        );
      }
      return updated;
    });
  };

  const getBookingsForDate = (date: Date): Booking[] => {
    const dateKey = formatDateKey(date);
    return allBookings[dateKey] || [];
  };

  const statistics = useMemo(() => {
    const stats = {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
    };

    for (const dayBookings of Object.values(allBookings)) {
      for (const booking of dayBookings) {
        stats.total++;
        stats[booking.status]++;
      }
    }

    return stats;
  }, [allBookings]);

  return {
    bookings: allBookings,
    selectedDate,
    statistics,
    setSelectedDate,
    addBooking,
    updateBookingStatus,
    getBookingsForDate,
  };
}