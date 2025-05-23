import { useState, useCallback, useEffect } from "react";

import { Task } from "../types/Task";
import { TaskStorageClient } from "@/sdk/TaskStorageClient";

export function useTaskTracker(client: TaskStorageClient) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = useCallback(
    (name: string) => {
      client.addTask(name).then((tasks) => setTasks(tasks));
    },
    [client]
  );

  const updateTaskActive = useCallback(
    (id: string, isActive: boolean) => {
      client.updateTaskActive(id, isActive).then((tasks) => setTasks(tasks));
    },
    [client]
  );

  // Initialize tasks loading
  useEffect(() => {
    client.init((tasks) => {
      setTasks(tasks);
    });

    return () => {
      client.dispose();
    };
  }, [client]);

  return { tasks, addTask, updateTaskActive };
}
