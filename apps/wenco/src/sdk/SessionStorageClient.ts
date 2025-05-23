import { Task } from "@/types/Task";
import { TaskStorageClient } from "./TaskStorageClient";

class SessionStorageClient extends TaskStorageClient {
  private key: string;
  private timer: NodeJS.Timer | undefined;
  private lastUpdatedTime = Date.now();

  constructor(key: string) {
    super();
    this.key = key;
  }

  override init(onDataUpdate: (tasks: Task[]) => void) {
    console.log("init");
    this.getTasks(true).then((tasks) => {
      console.log("init", tasks);
      if (tasks == null) return;
      this.saveTasks(tasks);
      onDataUpdate?.(tasks);
    });

    this.timer = setInterval(() => {
      this.getTasks().then((tasks) => {
        if (tasks == null) return;
        const newTasks = tasks.map((task) =>
          task.isActive ? { ...task, timeSpent: task.timeSpent + 1 } : task
        );
        console.log("newTasks", newTasks);
        this.saveTasks(newTasks);
        this.lastUpdatedTime = Date.now();
        onDataUpdate?.(newTasks);
      });
    }, 1000);
  }

  override dispose(): void {
    clearInterval(this.timer);
  }

  override async getTasks(isInit = false) {
    try {
      const item = window.sessionStorage.getItem(this.key);
      const tasks = item ? (JSON.parse(item) as Task[]) : undefined;
      if (isInit) {
        return tasks?.map((task) =>
          task.isActive
            ? {
                ...task,
                timeSpent:
                  task.timeSpent + (Date.now() - this.lastUpdatedTime) / 1000,
              }
            : task
        );
      }
      return tasks;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }

  async saveTasks(tasks: Task[]) {
    try {
      window.sessionStorage.setItem(this.key, JSON.stringify(tasks));
    } catch (e) {
      console.error(e);
    }
  }

  override async addTask(taskName: string) {
    return this.getTasks().then((tasks) => {
      if (tasks == null) return [];
      const task: Task = {
        id: Date.now().toString(),
        name: taskName,
        timeSpent: 0,
        isActive: false,
      };
      tasks.push(task);
      this.saveTasks(tasks);
      return tasks;
    });
  }

  override async updateTaskActive(id: string, isActive: boolean) {
    return this.getTasks().then((tasks) => {
      if (tasks == null) return [];
      const newTasks = tasks.map((task) =>
        task.id === id ? { ...task, isActive } : task
      );
      this.saveTasks(newTasks);
      return newTasks;
    });
  }
}

export default SessionStorageClient;
