import { useState, useEffect } from "react";
import type { Task, TaskStatus } from "@/types";
import { fileStorage } from "@/lib/fileStorage";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("kanban-tasks");
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("kanban-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (title: string, description?: string, dueDate?: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      description,
      status: "todo",
      priority: "medium",
      dueDate,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const moveTask = (id: string, status: TaskStatus) => {
    updateTask(id, { status });
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  const getTasksForDate = (date: string) => {
    return tasks.filter(task => task.dueDate === date);
  };

  const exportTasks = () => {
    fileStorage.save(tasks);
  };

  const importTasks = async () => {
    const importedTasks = await fileStorage.load();
    if (importedTasks.length > 0) {
      setTasks(importedTasks);
    }
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    getTasksByStatus,
    getTasksForDate,
    exportTasks,
    importTasks,
  };
}