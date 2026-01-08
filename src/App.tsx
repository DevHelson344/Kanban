import { useState } from "react";
import { CalendarScheduler } from "@/components/CalendarScheduler";
import { BookingDetailsPanel } from "@/components/BookingDetailsPanel";
import { KanbanBoard } from "@/components/KanbanBoard";
import { LoginForm } from "@/components/LoginForm";
import { useCalendarData } from "@/hooks/useCalendarData";
import { useTasks } from "@/hooks/useTasks";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, User } from "lucide-react";

export function App() {
  const [activeTab, setActiveTab] = useState<"calendar" | "kanban">("kanban");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  
  const { user, isLoading, login, logout } = useAuth();

  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    exportTasks,
    importTasks,
  } = useTasks();

  const {
    bookings,
    selectedDate,
    setSelectedDate,
    getBookingsForDate,
  } = useCalendarData({ initialBookings: {}, tasks });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm onLogin={login} />;
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedDate(null);
  };

  const selectedDateBookings = selectedDate ? getBookingsForDate(selectedDate) : [];

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === "todo").length,
    doing: tasks.filter(t => t.status === "doing").length,
    done: tasks.filter(t => t.status === "done").length,
    overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "done").length,
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <div className="flex-shrink-0 p-6 pb-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Sistema de Produtividade
          </h1>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{user.name}</span>
            </div>
            
            <button
              onClick={logout}
              className="p-2 rounded-md bg-red-100 hover:bg-red-200 text-red-600"
              title="Sair"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("kanban")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "kanban"
                ? "bg-blue-600 text-white"
                : "bg-white border text-gray-900 hover:bg-gray-50"
            }`}
          >
            Kanban
          </button>
          <button
            onClick={() => setActiveTab("calendar")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "calendar"
                ? "bg-blue-600 text-white"
                : "bg-white border text-gray-900 hover:bg-gray-50"
            }`}
          >
            Calendário
          </button>
        </div>

        {/* Stats */}
        {activeTab === "kanban" ? (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-blue-600">{taskStats.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-gray-600">{taskStats.todo}</div>
              <div className="text-sm text-gray-600">A Fazer</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-yellow-600">{taskStats.doing}</div>
              <div className="text-sm text-gray-600">Fazendo</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-green-600">{taskStats.done}</div>
              <div className="text-sm text-gray-600">Concluído</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-red-600">{taskStats.overdue}</div>
              <div className="text-sm text-gray-600">Atrasadas</div>
            </div>
          </div>
        ) : (
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 ${isPanelOpen ? "mr-96" : ""}`}>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-blue-600">
                {tasks.filter(t => t.dueDate).length}
              </div>
              <div className="text-sm text-gray-600">Tarefas com Data</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-yellow-600">
                {tasks.filter(t => t.dueDate && t.status === "doing").length}
              </div>
              <div className="text-sm text-gray-600">Em Andamento</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-green-600">
                {tasks.filter(t => t.dueDate && t.status === "done").length}
              </div>
              <div className="text-sm text-gray-600">Concluídas</div>
            </div>
          </div>
        )}
      </div>

      <div className={`flex-1 px-6 pb-6 overflow-hidden ${isPanelOpen && activeTab === "calendar" ? "mr-96" : ""}`}>
        {activeTab === "calendar" ? (
          <CalendarScheduler
            bookings={bookings}
            onDateClick={handleDateClick}
            onBookingClick={() => {}}
          />
        ) : (
          <KanbanBoard
            tasks={tasks}
            onAddTask={addTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onMoveTask={moveTask}
            onExportTasks={exportTasks}
            onImportTasks={importTasks}
          />
        )}
      </div>

      {isPanelOpen && activeTab === "calendar" && (
        <BookingDetailsPanel
          date={selectedDate}
          bookings={selectedDateBookings}
          onClose={handleClosePanel}
          onBookingClick={() => {}}
        />
      )}
    </div>
  );
}