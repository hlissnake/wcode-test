import { useState, useCallback, useEffect } from "react";
import { Task } from "../types/Task";

export function useTasks(initialTasks: Task[] = []) {
  const [startActive, setStartActive] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (startActive) {
      timeout = setInterval(() => {
        // TODO: calling update task timespent API request
        setTasks((prev) =>
          prev.map((task) =>
            task.isActive ? { ...task, timeSpent: task.timeSpent + 1 } : task
          )
        );
      }, 1000);
    }
    return () => {
      if (timeout) {
        clearInterval(timeout);
      }
    };
  }, [startActive]);

  const addTask = useCallback((name: string) => {
    // TODO: calling add task API request
    setTasks((prev) => [
      ...prev,
      { id: Math.random().toString(36), name, timeSpent: 0, isActive: false },
    ]);
  }, []);

  const updateTaskActive = useCallback((id: string, isActive: boolean) => {
    // TODO: calling update task active API request
    setStartActive(true);
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, isActive } : task))
    );
  }, []);

  return { tasks, addTask, updateTaskActive };
}
