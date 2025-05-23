"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const TaskTimeTracker = dynamic(() => import("@/components/TaskTimeTracker"), {
  ssr: false,
});

export default function Index() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div>
      <div className="wrapper">
        <div className="container">
          <div id="welcome">
            <h1>
              <span> Hello @Wenco, </span>
              Task Time Tracker 👋
            </h1>
          </div>

          <TaskTimeTracker />
        </div>
      </div>
    </div>
  );
}
