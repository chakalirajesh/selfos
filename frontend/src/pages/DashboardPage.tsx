import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import dashboardApi from "../api/dashboardApi";

import DashboardChart from "../components/dashboard/DashboardChart";
import RecentActivity from "../components/dashboard/RecentActivity";
import StatCard from "../components/dashboard/StatCard";
import GoalProgressCard from "../components/dashboard/GoalProgressCard";
import RecentTasks from "../components/dashboard/RecentTasks";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {

  const [data, setData] = useState<any>(null);
  const navigate = useNavigate();

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
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <div className="text-xl font-semibold animate-pulse">
            Loading Dashboard...
          </div>
        </div>
      </MainLayout>
    );
  }
  const productivityScore =
    data.totalTasks > 0
      ? Math.round(
        (data.completedTasks / data.totalTasks) * 100
      )
      : 0;

  return (
    <MainLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white">
          Dashboard
        </h1>

        <p className="text-slate-500 mt-2">
          Welcome back 🚀 Here's your productivity overview.
        </p>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl mb-8">
        <h2 className="text-3xl font-bold">
          Welcome to SelfOS
        </h2>

        <p className="mt-3 text-lg">
          Manage tasks, goals, projects, notes and habits in one place.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">

        <StatCard
          title="Tasks"
          value={data.totalTasks}
          subtitle={`${data.completedTasks} completed`}
          color="text-blue-600"
        />

        <StatCard
          title="Goals"
          value={data.totalGoals}
          subtitle={`${data.completedGoals} completed`}
          color="text-green-600"
        />

        <StatCard
          title="Projects"
          value={data.totalProjects}
          subtitle={`${data.activeProjects} active`}
          color="text-purple-600"
        />

        <StatCard
          title="Notes"
          value={data.totalNotes}
          color="text-orange-600"
        />

        <StatCard
          title="Habits"
          value={data.totalHabits}
          subtitle={`${data.activeHabits} active`}
          color="text-red-600"
        />

      </div>
      {/* Bottom Section */}
      <div className="grid lg:grid-cols-2 gap-6">

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold mb-4">
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 gap-4">

            <button
              onClick={() => navigate("/tasks")}
              className="bg-blue-600 text-white p-3 rounded-lg"
            >
              + New Task
            </button>

            <button
              onClick={() => navigate("/goals")}
              className="bg-green-600 text-white p-3 rounded-lg"
            >
              + New Goal
            </button>

            <button
              onClick={() => navigate("/projects")}
              className="bg-purple-600 text-white p-3 rounded-lg"
            >
              + New Project
            </button>

            <button
              onClick={() => navigate("/notes")}
              className="bg-orange-600 text-white p-3 rounded-lg"
            >
              + New Note
            </button>

          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">

          <h2 className="text-xl font-bold mb-4">
            Productivity Score
          </h2>

          <div className="flex items-center justify-center h-48">

            <div className="w-36 h-36 rounded-full border-[12px] border-blue-600 flex items-center justify-center">

              <div className="text-center">
                <h1 className="text-3xl font-bold">
                  {productivityScore}%
                </h1>

                <p className="text-sm text-slate-500">
                  Progress
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
      <div className="mt-8">
        <DashboardChart dashboard={data} />
      </div>
      <div className="mt-8">
        <RecentActivity />
      </div>
      <div className="grid lg:grid-cols-2 gap-6 mt-8">

        <GoalProgressCard />

        <RecentTasks />

      </div>


    </MainLayout>
  );
}