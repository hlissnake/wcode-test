import { FormEvent, useCallback, useState } from "react";

import TaskComponent from "@/components/Task";
// import { useTasks } from "@/hooks/useTasks";
import { useTaskTracker } from "@/hooks/useTaskTracker";
import SessionStorageClient from "@/sdk/sessionStorageClient";

const TASKS_SESSIONSTORAGE_KEY = "tasks_sessionstorage_key";
// Storage Client by using SessionStorage,
const sessionStorageClient = new SessionStorageClient(TASKS_SESSIONSTORAGE_KEY);

// TODO: Client with API or Web Scoket

export default function TaskTimeTracker() {
  // Use a custom hook to manage tasks,
  // instead of using Reducer Context bcoz its not a global state yet, just for simple demo
  const { tasks, addTask, updateTaskActive } =
    useTaskTracker(sessionStorageClient);

  const [taskName, setTaskName] = useState("");

  const handleFromSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (taskName) {
        setTaskName("");
        addTask(taskName);
      }
    },
    [addTask, taskName]
  );

  return (
    <div>
      <form
        className="p-4 rounded-md shadow-lg my-4 flex justify-between"
        onSubmit={handleFromSubmit}
      >
        <input
          className="border rounded-lg p-2"
          type="text"
          placeholder="Add task name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <button
          className="px-4 py-2 rounded-md bg-green-500 hover:bg-green-600 text-white"
          type="submit"
        >
          Add
        </button>
      </form>

      <div id="task-list">
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <TaskComponent task={task} onUpdateActive={updateTaskActive} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
