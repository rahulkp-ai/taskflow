import clsx from "clsx";
import { useGetAllTaskQuery } from "../redux/slices/api/taskApiSlice";
import Loading from "../components/Loading";
import Title from "../components/Title";
import { TASK_TYPE } from "../utils";

const STAGES = ["todo", "in progress", "completed"];

const Status = () => {
  const { data, isLoading } = useGetAllTaskQuery({
    strQuery: "",
    isTrashed: false,
    search: "",
  });

  if (isLoading) return <Loading />;

  const tasks = data?.tasks || [];
  const total = tasks.length;

  const counts = STAGES.reduce((acc, s) => {
    acc[s] = tasks.filter((t) => t.stage === s).length;
    return acc;
  }, {});

  const pct = (n) => (total ? Math.round((n / total) * 100) : 0);

  return (
    <div className="space-y-5">
      <Title title="Project Status" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STAGES.map((stage) => (
          <div key={stage} className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className={clsx("w-3 h-3 rounded-full", TASK_TYPE[stage])} />
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 capitalize">
                {stage}
              </h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {counts[stage]}
            </p>
            <p className="text-xs text-gray-400">{pct(counts[stage])}% of total</p>
            <div className="mt-3 w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={clsx("h-full rounded-full transition-all duration-500", TASK_TYPE[stage])}
                style={{ width: `${pct(counts[stage])}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="card p-5">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Overall Progress</h2>
        <div className="flex items-center gap-4 mb-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Total Tasks</span>
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{total}</span>
        </div>
        <div className="w-full h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex">
          {STAGES.map((stage) => (
            <div
              key={stage}
              className={clsx("h-full transition-all duration-500", TASK_TYPE[stage])}
              style={{ width: `${pct(counts[stage])}%` }}
              title={`${stage}: ${counts[stage]}`}
            />
          ))}
        </div>
        <div className="flex gap-4 mt-2">
          {STAGES.map((stage) => (
            <div key={stage} className="flex items-center gap-1.5">
              <div className={clsx("w-2.5 h-2.5 rounded-full", TASK_TYPE[stage])} />
              <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{stage}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Status;
