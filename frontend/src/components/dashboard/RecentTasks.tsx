import { useEffect, useState } from "react";
import taskApi from "../../api/taskApi";

export default function RecentTasks() {

  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {

    const fetchTasks = async () => {

      try {

        const token =
          localStorage.getItem("accessToken");

        const response =
          await taskApi.get("", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

        setTasks(response.data.slice(0, 5));

      } catch (error) {
        console.error(error);
      }
    };

    fetchTasks();

  }, []);

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">

      <h2 className="text-xl font-bold mb-4">
        Recent Tasks
      </h2>

      <div className="space-y-3">

        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg"
          >
            {task.title}
          </div>
        ))}

      </div>

    </div>
  );
}