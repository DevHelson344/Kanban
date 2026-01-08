import { Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Booking } from "@/types";

interface BookingDetailsPanelProps {
  date: Date | null;
  bookings: Booking[];
  onClose: () => void;
  onBookingClick?: (booking: Booking) => void;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  approved: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
};

const statusLabels = {
  pending: "Aguardando",
  approved: "Aprovado",
  rejected: "Reprovado",
};

export function BookingDetailsPanel({
  date,
  bookings,
  onClose,
  onBookingClick,
}: BookingDetailsPanelProps) {
  if (!date) return null;

  const sortedBookings = [...bookings].sort((a, b) =>
    a.time.localeCompare(b.time)
  );

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl border-l z-50 overflow-y-auto">
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">
              {date.toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </h3>
            <p className="text-sm text-gray-600">
              {bookings.length} agendamento{bookings.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            className="p-2 hover:bg-gray-200 rounded-md"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {sortedBookings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum agendamento para esta data</p>
          </div>
        ) : (
          sortedBookings.map((booking) => (
            <div
              key={booking.id}
              className={cn(
                "p-4 cursor-pointer hover:shadow-md transition-shadow border rounded-lg",
                statusColors[booking.status]
              )}
              onClick={() => onBookingClick?.(booking)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{booking.title}</h4>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                      <Clock className="h-3 w-3" />
                      <span>{booking.time}</span>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "text-xs px-2 py-1 rounded border",
                      statusColors[booking.status]
                    )}
                  >
                    {statusLabels[booking.status]}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {bookings.length > 0 && (
        <div className="p-4 border-t bg-gray-50 mt-auto">
          <h4 className="font-medium text-sm mb-2">Resumo do dia</h4>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="font-medium text-yellow-600">
                {bookings.filter((b) => b.status === "pending").length}
              </div>
              <div className="text-gray-600">Pendentes</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-green-600">
                {bookings.filter((b) => b.status === "approved").length}
              </div>
              <div className="text-gray-600">Aprovados</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-red-600">
                {bookings.filter((b) => b.status === "rejected").length}
              </div>
              <div className="text-gray-600">Rejeitados</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}