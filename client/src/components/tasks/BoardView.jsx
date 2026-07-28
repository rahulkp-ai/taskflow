import clsx from "clsx";
import { TASK_TYPE } from "../../utils";
import TaskCard from "./TaskCard";

const STAGES = ["todo", "in progress", "completed"];

const STAGE_LABELS = {
  todo: "To Do",
  "in progress": "In Progress",
  completed: "Completed",
};

const STAGE_COLORS = {
  todo: "border-t-blue-500",
  "in progress": "border-t-yellow-500",
  completed: "border-t-green-500",
};

const BoardView = ({ tasks = [], onStageChange, onEdit, refetch }) => {
  const grouped = STAGES.reduce((acc, stage) => {
    acc[stage] = tasks.filter((t) => t.stage === stage);
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {STAGES.map((stage) => (
        <div key={stage} className="flex flex-col gap-3">
          {/* Column Header */}
          <div
            className={clsx(
              "card border-t-4 px-4 py-3 flex items-center justify-between",
              STAGE_COLORS[stage]
            )}
          >
            <div className="flex items-center gap-2">
              <div className={clsx("w-2.5 h-2.5 rounded-full", TASK_TYPE[stage])} />
              <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm">
                {STAGE_LABELS[stage]}
              </h3>
            </div>
            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full font-medium">
              {grouped[stage].length}
            </span>
          </div>

          {/* Task Cards */}
          <div className="flex flex-col gap-3 min-h-[200px]">
            {grouped[stage].length === 0 ? (
              <div className="flex items-center justify-center h-24 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-400">No tasks</p>
              </div>
            ) : (
              grouped[stage].map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={onEdit}
                  refetch={refetch}
                />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BoardView;
