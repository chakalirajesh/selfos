import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

type DashboardChartProps = {
  dashboard: any;
};

export default function DashboardChart({
  dashboard
}: DashboardChartProps) {

  const chartData = [
    {
      name: "Tasks",
      value: dashboard.totalTasks
    },
    {
      name: "Goals",
      value: dashboard.totalGoals
    },
    {
      name: "Projects",
      value: dashboard.totalProjects
    },
    {
      name: "Notes",
      value: dashboard.totalNotes
    },
    {
      name: "Habits",
      value: dashboard.totalHabits
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">

      <h2 className="text-xl font-bold mb-4">
        Productivity Analytics
      </h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="value"
            fill="#3b82f6"
          />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}