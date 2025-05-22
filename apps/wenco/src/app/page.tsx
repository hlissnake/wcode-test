"use client";

import TaskComponent from "@/components/Task";
import { FormEvent, useCallback, useState } from "react";

export default function Index() {
  // Test data
  const [tasks, setTasks] = useState([
    {
      id: "1",
      name: "Complete project documentation",
      timeSpent: 0,
      isActive: false,
    },
    {
      id: "2",
      name: "Fix navigation bug",
      timeSpent: 0,
      isActive: false,
    },
  ]);

  const [taskName, setTaskName] = useState("");

  const handleTaskUpdateActive = (taskId: string, isActive: boolean) => {
    console.log("Task updated:", taskId, isActive);
  };

  const handleTaskUpdateTimeSpent = (taskId: string, timeSpent: number) => {
    console.log("Task updated:", taskId, timeSpent);
  };

  const handleFromSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (taskName) {
        const newTask = {
          id: Math.random().toString(36),
          name: taskName,
          timeSpent: 0,
          isActive: false,
        };
        setTaskName("");
        setTasks((prev) => [...prev, newTask]);
      }
    },
    [taskName]
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
            className="p-4 border rounded-lg shadow-sm my-4 flex justify-between"
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
                    onUpdateActive={handleTaskUpdateActive}
                    onUpdateTimeSpent={handleTaskUpdateTimeSpent}
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
