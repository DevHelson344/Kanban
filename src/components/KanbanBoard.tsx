import { useState } from "react";
import { Plus, Calendar, Trash2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskFilters } from "@/components/TaskFilters";
import { useTaskFilters } from "@/hooks/useTaskFilters";
import type { Task, TaskStatus, TaskPriority } from "@/types";

interface KanbanBoardProps {
  tasks: Task[];
  onAddTask: (title: string, description?: string, dueDate?: string) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onMoveTask: (id: string, status: TaskStatus) => void;
  onExportTasks: () => void;
  onImportTasks: () => void;
}

const columns: { id: TaskStatus; title: string; color: string }[] = [
  { id: "todo", title: "A Fazer", color: "bg-gray-100" },
  { id: "doing", title: "Fazendo", color: "bg-blue-100" },
  { id: "done", title: "Concluído", color: "bg-green-100" },
];

const priorityColors = {
  low: "border-l-green-500",
  medium: "border-l-yellow-500",
  high: "border-l-red-500",
};

const isOverdue = (dueDate: string) => {
  return new Date(dueDate) < new Date();
};

export function KanbanBoard({ tasks, onAddTask, onUpdateTask, onDeleteTask, onMoveTask, onExportTasks, onImportTasks }: KanbanBoardProps) {
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: "" });
  
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    dueDateFilter,
    setDueDateFilter,
    filteredTasks,
  } = useTaskFilters(tasks);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.title.trim()) {
      onAddTask(newTask.title, newTask.description || undefined, newTask.dueDate || undefined);
      setNewTask({ title: "", description: "", dueDate: "" });
      setShowForm(false);
    }
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return filteredTasks.filter(task => task.status === status);
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("text/plain", taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    onMoveTask(taskId, status);
  };

  const overdueTasks = tasks.filter(t => t.dueDate && isOverdue(t.dueDate) && t.status !== "done").length;

  return (
    <div className="h-screen bg-white rounded-lg shadow-sm border p-6 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Kanban Board</h2>
          {overdueTasks > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-md text-sm">
              <AlertTriangle className="h-4 w-4" />
              {overdueTasks} atrasada{overdueTasks > 1 ? 's' : ''}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onImportTasks}
            className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
          >
            Importar
          </button>
          <button
            onClick={onExportTasks}
            className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
          >
            Exportar
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Nova Tarefa
          </button>
        </div>
      </div>

      <TaskFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
        dueDateFilter={dueDateFilter}
        onDueDateChange={setDueDateFilter}
      />

      {showForm && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50 flex-shrink-0">
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Título da tarefa"
              value={newTask.title}
              onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md"
              autoFocus
            />
            <textarea
              placeholder="Descrição (opcional)"
              value={newTask.description}
              onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md h-20 resize-none"
            />
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
              className="px-3 py-2 border rounded-md"
            />
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Adicionar
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 overflow-hidden">
        {columns.map(column => {
          const columnTasks = getTasksByStatus(column.id);
          return (
            <div
              key={column.id}
              className={cn("rounded-lg p-4 flex flex-col", column.color)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <h3 className="font-medium mb-4 flex items-center justify-between flex-shrink-0">
                {column.title}
                <span className="text-sm bg-white px-2 py-1 rounded">
                  {columnTasks.length}
                </span>
              </h3>
              
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {columnTasks.map(task => {
                  const taskOverdue = task.dueDate && isOverdue(task.dueDate) && task.status !== "done";
                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className={cn(
                        "bg-white p-3 rounded-md shadow-sm border-l-4 cursor-move hover:shadow-md transition-shadow flex-shrink-0",
                        priorityColors[task.priority],
                        taskOverdue && "ring-2 ring-red-300"
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm flex items-center gap-2">
                            {task.title}
                            {taskOverdue && <AlertTriangle className="h-3 w-3 text-red-500" />}
                          </h4>
                        </div>
                        <button
                          onClick={() => onDeleteTask(task.id)}
                          className="text-gray-400 hover:text-red-500 p-1 flex-shrink-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                      
                      {task.description && (
                        <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <select
                          value={task.priority}
                          onChange={(e) => onUpdateTask(task.id, { priority: e.target.value as TaskPriority })}
                          className="text-xs border-none bg-transparent"
                        >
                          <option value="low">Baixa</option>
                          <option value="medium">Média</option>
                          <option value="high">Alta</option>
                        </select>
                        
                        {task.dueDate && (
                          <div className={cn(
                            "flex items-center gap-1",
                            taskOverdue && "text-red-600 font-medium"
                          )}>
                            <Calendar className="h-3 w-3" />
                            {new Date(task.dueDate).toLocaleDateString("pt-BR")}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}