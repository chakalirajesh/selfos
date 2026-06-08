type StatCardProps = {
  title: string;
  value: number;
  subtitle?: string;
  color: string;
};

export default function StatCard({
  title,
  value,
  subtitle,
  color
}: StatCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">

      <h3 className="text-slate-500">
        {title}
      </h3>

      <p className={`text-4xl font-bold mt-2 ${color}`}>
        {value}
      </p>

      {subtitle && (
        <p className="text-sm text-slate-500 mt-2">
          {subtitle}
        </p>
      )}

    </div>
  );
}