import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import dashboardApi from "../api/dashboardApi";

export default function DashboardPage() {

  const [data, setData] = useState<any>(null);

  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        const token =
          localStorage.getItem("accessToken");

        const response =
          await dashboardApi.get("", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

        setData(response.data);

      } catch (error) {
        console.error(error);
      }
    };

    fetchDashboard();

  }, []);

  if (!data) {
    return <h1>Loading...</h1>;
  }

  return (
    <MainLayout>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">

        <div className="bg-blue-500 text-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold">
            Tasks
          </h2>

          <p className="text-4xl font-bold mt-2">
            {data.totalTasks}
          </p>
        </div>

        <div className="bg-green-500 text-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold">
            Goals
          </h2>

          <p className="text-4xl font-bold mt-2">
            {data.totalGoals}
          </p>
        </div>

        <div className="bg-purple-500 text-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold">
            Projects
          </h2>

          <p className="text-4xl font-bold mt-2">
            {data.totalProjects}
          </p>
        </div>

        <div className="bg-orange-500 text-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold">
            Notes
          </h2>

          <p className="text-4xl font-bold mt-2">
            {data.totalNotes}
          </p>
        </div>

        <div className="bg-red-500 text-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold">
            Habits
          </h2>

          <p className="text-4xl font-bold mt-2">
            {data.totalHabits}
          </p>
        </div>

      </div>

    </MainLayout>
  );
}