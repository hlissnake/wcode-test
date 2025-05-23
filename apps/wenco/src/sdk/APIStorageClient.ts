import { Task } from "@/types/Task";
import { TaskStorageClient } from "./TaskStorageClient";

class APIStorageClient extends TaskStorageClient {
  override init(onDataUpdate: (tasks: Task[]) => void) {
    console.log("init");
    this.getTasks(true).then((tasks) => {
      onDataUpdate?.(tasks);
    });
    // Use WebScoket heartbeat to sync data with the actual cumulative time spent on the Server Side
    // Socket.onmessage = (event) => {
    //   const tasks = JSON.parse(event.data) as Task[];
    //   onDataUpdate?.(tasks);
    // };
  }

  override dispose(): void {
    // TODO: dispose api & socket client
  }

  override async getTasks(isInit = false) {
    const res = await fetch("/api/tasks");
    const tasks = await res.json();
    return tasks as Task[];
  }

  override async addTask(taskName: string) {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: taskName }),
    });
    const tasks = await res.json();
    return tasks as Task[];
  }

  override async updateTaskActive(id: string, isActive: boolean) {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isActive }),
    });
    const tasks = await res.json();
    return tasks as Task[];
  }
}

export default APIStorageClient;
