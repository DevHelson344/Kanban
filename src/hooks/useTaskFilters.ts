import { useState, useMemo } from "react";
import type { Task, TaskStatus, TaskPriority } from "@/types";

export function useTaskFilters(tasks: Task[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "all">("all");
  const [dueDateFilter, setDueDateFilter] = useState<"all" | "today" | "week" | "overdue">("all");

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || task.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
      
      let matchesDueDate = true;
      if (dueDateFilter !== "all" && task.dueDate) {
        const today = new Date();
        const taskDate = new Date(task.dueDate);
        const diffDays = Math.ceil((taskDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        switch (dueDateFilter) {
          case "today":
            matchesDueDate = diffDays === 0;
            break;
          case "week":
            matchesDueDate = diffDays >= 0 && diffDays <= 7;
            break;
          case "overdue":
            matchesDueDate = diffDays < 0;
            break;
        }
      } else if (dueDateFilter !== "all") {
        matchesDueDate = false;
      }

      return matchesSearch && matchesStatus && matchesPriority && matchesDueDate;
    });
  }, [tasks, searchTerm, statusFilter, priorityFilter, dueDateFilter]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    dueDateFilter,
    setDueDateFilter,
    filteredTasks,
  };
}