export default function GoalProgressCard() {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">

      <h2 className="text-xl font-bold mb-4">
        Goal Progress
      </h2>

      <div className="space-y-4">

        <div>
          <div className="flex justify-between mb-1">
            <span>Learn Kubernetes</span>
            <span>80%</span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full"
              style={{ width: "80%" }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span>DSA Practice</span>
            <span>65%</span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-3">
            <div
              className="bg-green-600 h-3 rounded-full"
              style={{ width: "65%" }}
            />
          </div>
        </div>

      </div>

    </div>
  );
}