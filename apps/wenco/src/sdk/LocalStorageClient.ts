import { Task } from "@/types/Task";
import { TaskStorageClient } from "./TaskStorageClient";

class LocalStorageClient extends TaskStorageClient {
  private key: string;
  private timer: NodeJS.Timer | undefined;

  constructor(key: string) {
    super();
    this.key = key;
  }

  override init(onDataUpdate: (tasks: Task[]) => void) {
    this.getTasks(true).then((tasks) => {
      this.saveTasks(tasks);
      onDataUpdate?.(tasks);
    });

    this.timer = setInterval(() => {
      this.getTasks().then((tasks) => {
        const newTasks = tasks.map((task) =>
          task.isActive
            ? { ...task, timeSpent: Math.floor(task.timeSpent + 1) }
            : task
        );
        this.saveTasks(newTasks);
        this.saveLastUpdatedTime(Date.now());
        onDataUpdate?.(newTasks);
      });
    }, 1000);
  }

  override dispose(): void {
    clearInterval(this.timer);
  }

  override async getTasks(isInit = false) {
    try {
      const item = window.localStorage.getItem(this.key);
      const tasks = item ? (JSON.parse(item) as Task[]) : [];

      // Time spent should be calculated based on the last updated time even if the web page is not loaded
      if (isInit) {
        const lastUpdatedTime = this.getLastUpdatedTime();
        return tasks?.map((task) =>
          task.isActive
            ? {
                ...task,
                timeSpent: Math.floor(
                  task.timeSpent + (Date.now() - lastUpdatedTime) / 1000
                ),
              }
            : task
        );
      }
      return tasks;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  async saveTasks(tasks: Task[]) {
    try {
      window.localStorage.setItem(this.key, JSON.stringify(tasks));
    } catch (e) {
      console.error(e);
    }
  }

  saveLastUpdatedTime(time: number) {
    try {
      window.localStorage.setItem(
        `${this.key}_LAST_UPDATED_TIME`,
        time.toString()
      );
    } catch (e) {
      console.error(e);
    }
  }

  getLastUpdatedTime(): number {
    try {
      const item = window.localStorage.getItem(
        `${this.key}_LAST_UPDATED_TIME`
      );
      return item ? parseInt(item) : Date.now();
    } catch (e) {
      console.error(e);
      return Date.now();
    }
  }

  override async addTask(taskName: string) {
    return this.getTasks().then((tasks) => {
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

export default LocalStorageClient;
