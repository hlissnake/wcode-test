import { useState, useCallback, useEffect } from "react";

import { Task } from "../types/Task";
import { TaskStorageClient } from "@/sdk/TaskStorageClient";

export function useTaskTracker(client: TaskStorageClient) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = useCallback(
    (name: string) => {
      client.addTask(name);
    },
    [client]
  );

  const updateTaskActive = useCallback(
    (id: string, isActive: boolean) => {
      client.updateTaskActive(id, isActive);
    },
    [client]
  );

  // Initialize tasks loading
  useEffect(() => {
    client.init((tasks) => {
      console.log("init", tasks);
      setTasks(tasks);
    });
  }, [client]);

  // Central singleton timer controller, only one timer is active at a time
  useEffect(() => {
    return () => {
      client.dispose();
    };
  }, [client]);

  return { tasks, addTask, updateTaskActive };
}
