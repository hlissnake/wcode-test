import { useState, useEffect, useCallback } from "react";
import { Task } from "../types/Task";

interface TaskProps {
  task: Task;
  onUpdateActive: (taskId: string, isActive: boolean) => void;
  onUpdateTimeSpent: (taskId: string, timeSpent: number) => void;
}

function formatTime(timeInSeconds: number): string {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = timeInSeconds % 60;
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

export const TaskComponent: React.FC<TaskProps> = ({
  task,
  onUpdateActive,
  onUpdateTimeSpent,
}) => {
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [timeSpent, setTimeSpent] = useState(task.timeSpent);

  const handleToggleTimer = useCallback(() => {
    if (task.isActive && timer) {
      clearInterval(timer);
      setTimer(null);
    } else {
      setTimer(
        setInterval(() => {
          setTimeSpent((prev) => prev + 1); // Update timeSpent every second (1000ms)
        }, 1000)
      );
    }
    onUpdateActive(task.id, !task.isActive);
  }, [onUpdateActive, task, timer]);

  useEffect(() => {
    if ((task.isActive, timeSpent)) {
      onUpdateTimeSpent(task.id, timeSpent);
    }
  }, [onUpdateTimeSpent, task.id, task.isActive, timeSpent]);

  useEffect(() => {
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [timer]);

  return (
    <div className="task-container p-4 border rounded-lg shadow-lg my-4 flex justify-between">
      <div className="flex-col justify-between items-center">
        <h3 className="text-lg">Name: {task.name}</h3>
        <span
          className={`time-display text-lg ${
            task.isActive ? "text-green-500" : "text-red-500"
          }`}
        >
          Time Spent: {formatTime(timeSpent)}
        </span>
      </div>

      <div className="controls flex gap-2 mt-3">
        <button
          onClick={handleToggleTimer}
          className={`px-4 py-2 rounded-md ${
            task.isActive
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          {task.isActive ? "Stop" : "Start"}
        </button>
      </div>
    </div>
  );
};

export default TaskComponent;
