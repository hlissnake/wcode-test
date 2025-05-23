import { Task } from "../types/Task";

export abstract class TaskStorageClient {
  abstract init(onDataUpdate: (tasks: Task[]) => void): void;
  abstract dispose(): void;

  abstract getTasks(): Promise<Task[]>;
  abstract addTask(taskName: string): Promise<Task[]>;
  abstract updateTaskActive(id: string, isActive: boolean): Promise<Task[]>;
}
