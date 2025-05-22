"use client";

import TaskComponent from "@/components/Task";
import { useTasks } from "@/hooks/useTasks";
import { FormEvent, useCallback, useState } from "react";

export default function Index() {
  // Use a custom hook to manage tasks, instead of using Reducer Context as its not a global state yet, just for demo testing
  const { tasks, addTask, updateTaskActive, updateTaskTime } = useTasks();

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
      <div className="wrapper">
        <div className="container">
          <div id="welcome">
            <h1>
              <span> Hello Welcome, </span>
              @wenco/Task Time Tracker 👋
            </h1>
          </div>

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
                  <TaskComponent
                    task={task}
                    onUpdateActive={updateTaskActive}
                    onUpdateTimeSpent={updateTaskTime}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
