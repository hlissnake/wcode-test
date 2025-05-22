import { useState, useCallback, useEffect } from "react";
import { Task } from "../types/Task";
import { useSessionStorage } from "./useSessionStorage";

// TODO: Mock data
// const initialTasks: Task[] = [
//   { id: "1", name: "Task 1", timeSpent: 0, isActive: false },
//   { id: "2", name: "Task 2", timeSpent: 100, isActive: true },
// ];

const TASKS_SESSIONSTORAGE_KEY = "tasks_sessionstorage_key";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activateTimer, setActivateTimer] = useState(false);

  const [sessionValue, setSessionValue] = useSessionStorage<Task[]>(
    TASKS_SESSIONSTORAGE_KEY
  );

  const addTask = useCallback((name: string) => {
    // Unique id should generated in Backend API side, here use random to mock in Frontend
    setTasks((prev) => [
      ...prev,
      { id: Math.random().toString(36), name, timeSpent: 0, isActive: false },
    ]);
  }, []);

  const updateTaskActive = useCallback((id: string, isActive: boolean) => {
    if (isActive) {
      setActivateTimer(true);
    }
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, isActive } : task))
    );
  }, []);

  const [isLoaded, setLoaded] = useState(false);
  // Initialize tasks loading
  useEffect(() => {
    // TODO: Calling get tasks API request or Using mock data
    // fetch("test/tasks")
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setTasks(data);
    //   });
    if (isLoaded || sessionValue == null) return;
    setTasks(sessionValue);
    // If no task is active, don't activate the timer
    const taskActived = sessionValue.some((task) => task.isActive);
    setActivateTimer(taskActived);
    setLoaded(true);
  }, [isLoaded, sessionValue]);

  // Presist in SessionStorage
  useEffect(() => {
    // TODO: calling task API request for adding, updating active, time spent
    setSessionValue(tasks);
  }, [setSessionValue, tasks]);

  // Central singleton timer controller, only one timer is active at a time
  useEffect(() => {
    if (!activateTimer) {
      return;
    }
    // During timer, update the time spent for each task
    const timeout = setInterval(() => {
      setTasks((prev) =>
        prev.map((task) =>
          task.isActive ? { ...task, timeSpent: task.timeSpent + 1 } : task
        )
      );
    }, 1000);

    return () => {
      clearInterval(timeout);
    };
  }, [activateTimer]);

  return { tasks, addTask, updateTaskActive };
}
