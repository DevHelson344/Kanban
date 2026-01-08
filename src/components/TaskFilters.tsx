import { Search, Filter } from "lucide-react";
import type { TaskStatus, TaskPriority } from "@/types";

interface TaskFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: TaskStatus | "all";
  onStatusChange: (status: TaskStatus | "all") => void;
  priorityFilter: TaskPriority | "all";
  onPriorityChange: (priority: TaskPriority | "all") => void;
  dueDateFilter: "all" | "today" | "week" | "overdue";
  onDueDateChange: (filter: "all" | "today" | "week" | "overdue") => void;
}

export function TaskFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  dueDateFilter,
  onDueDateChange,
}: TaskFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Filtros</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar tarefas..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border rounded-md text-sm"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as TaskStatus | "all")}
          className="px-3 py-2 border rounded-md text-sm"
        >
          <option value="all">Todos os Status</option>
          <option value="todo">A Fazer</option>
          <option value="doing">Fazendo</option>
          <option value="done">Concluído</option>
        </select>
        
        <select
          value={priorityFilter}
          onChange={(e) => onPriorityChange(e.target.value as TaskPriority | "all")}
          className="px-3 py-2 border rounded-md text-sm"
        >
          <option value="all">Todas as Prioridades</option>
          <option value="high">Alta</option>
          <option value="medium">Média</option>
          <option value="low">Baixa</option>
        </select>
        
        <select
          value={dueDateFilter}
          onChange={(e) => onDueDateChange(e.target.value as "all" | "today" | "week" | "overdue")}
          className="px-3 py-2 border rounded-md text-sm"
        >
          <option value="all">Todas as Datas</option>
          <option value="today">Hoje</option>
          <option value="week">Esta Semana</option>
          <option value="overdue">Atrasadas</option>
        </select>
      </div>
    </div>
  );
}