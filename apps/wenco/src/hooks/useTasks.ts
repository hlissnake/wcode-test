import { useState, useCallback } from "react";
import { Task } from "../types/Task";

export function useTasks(initialTasks: Task[] = []) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const addTask = useCallback((name: string) => {
    // TODO: calling add task API request
    setTasks((prev) => [
      ...prev,
      { id: Math.random().toString(36), name, timeSpent: 0, isActive: false },
    ]);
  }, []);

  const updateTaskActive = useCallback((id: string, isActive: boolean) => {
    // TODO: calling update task active API request
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, isActive } : task))
    );
  }, []);

  const updateTaskTime = useCallback((id: string, timeSpent: number) => {
    // TODO: calling update task timespent API request
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, timeSpent } : task))
    );
  }, []);

  return { tasks, addTask, updateTaskActive, updateTaskTime };
}
