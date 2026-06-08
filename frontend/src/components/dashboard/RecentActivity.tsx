export default function RecentActivity() {

  const activities = [
    "✅ Completed Java Task",
    "🎯 Updated Goal",
    "📝 Added New Note",
    "🔥 Habit Completed",
    "📁 Project Updated"
  ];

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">

      <h2 className="text-xl font-bold mb-4">
        Recent Activity
      </h2>

      <div className="space-y-3">

        {activities.map((item, index) => (
          <div
            key={index}
            className="border-l-4 border-blue-500 pl-4 py-2"
          >
            {item}
          </div>
        ))}

      </div>

    </div>
  );
}