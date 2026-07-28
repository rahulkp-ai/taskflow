import clsx from "clsx";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FaTasks, FaCheckCircle, FaClock, FaListAlt } from "react-icons/fa";
import { useGetDashboardStatsQuery } from "../redux/slices/api/taskApiSlice";
import { DashboardSkeleton } from "../components/Loading";
import { BGS, PRIORITY_STYLES, TASK_TYPE, formatDate, getInitials } from "../utils";
import { UserAvatarGroup } from "../components/UserAvatar";

const StatsCard = ({ label, count, color, icon: Icon }) => (
  <div className="card p-5 flex items-center gap-4">
    <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center", color)}>
      <Icon className="text-white text-xl" />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{count}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  </div>
);

const PriorityBadge = ({ priority }) => (
  <span className={clsx("text-xs font-medium capitalize", PRIORITY_STYLES[priority] || PRIORITY_STYLES.normal)}>
    ● {priority}
  </span>
);

const RecentTaskRow = ({ task }) => (
  <tr className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
    <td className="py-3 px-4">
      <div className="flex items-center gap-2">
        <div className={clsx("w-2 h-2 rounded-full", TASK_TYPE[task.stage])} />
        <span className="text-sm text-gray-800 dark:text-gray-200 font-medium line-clamp-1">
          {task.title}
        </span>
      </div>
    </td>
    <td className="py-3 px-4">
      <PriorityBadge priority={task.priority} />
    </td>
    <td className="py-3 px-4">
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {formatDate(task.date)}
      </span>
    </td>
    <td className="py-3 px-4">
      <UserAvatarGroup users={task.team} max={3} size="sm" />
    </td>
  </tr>
);

const UserRow = ({ user }) => (
  <tr className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
    <td className="py-3 px-4">
      <div className="flex items-center gap-3">
        <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold", BGS[0])}>
          {getInitials(user.name)}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{user.name}</p>
          <p className="text-xs text-gray-400">{user.title}</p>
        </div>
      </div>
    </td>
    <td className="py-3 px-4">
      <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</span>
    </td>
    <td className="py-3 px-4">
      <span className={clsx("text-xs px-2 py-0.5 rounded-full font-medium", user.isActive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400")}>
        {user.isActive ? "Active" : "Inactive"}
      </span>
    </td>
  </tr>
);

const Dashboard = () => {
  const { data, isLoading, isError } = useGetDashboardStatsQuery();

  if (isLoading) return <DashboardSkeleton />;
  if (isError)
    return (
      <div className="text-center py-16 text-gray-500 dark:text-gray-400">
        Failed to load dashboard. Please refresh.
      </div>
    );

  const stats = [
    { label: "Total Tasks", count: data?.totalTasks, color: "bg-blue-600", icon: FaTasks },
    { label: "Completed", count: data?.tasks?.completed || 0, color: "bg-green-600", icon: FaCheckCircle },
    { label: "In Progress", count: data?.tasks?.["in progress"] || 0, color: "bg-yellow-500", icon: FaClock },
    { label: "To Do", count: data?.tasks?.todo || 0, color: "bg-gray-500", icon: FaListAlt },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatsCard key={s.label} {...s} />
        ))}
      </div>

      {/* Chart */}
      <div className="card p-5">
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Tasks by Priority
        </h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data?.graphData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} className="capitalize" />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Tasks" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="font-semibold text-gray-800 dark:text-gray-100">Recent Tasks</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  {["Task", "Priority", "Due Date", "Team"].map((h) => (
                    <th key={h} className="py-2.5 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.last10Task?.map((task) => (
                  <RecentTaskRow key={task._id} task={task} />
                ))}
              </tbody>
            </table>
            {!data?.last10Task?.length && (
              <p className="text-center text-sm text-gray-400 py-8">No tasks yet</p>
            )}
          </div>
        </div>

        {/* Team Members */}
        {data?.users?.length > 0 && (
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="font-semibold text-gray-800 dark:text-gray-100">Team Members</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    {["Name", "Role", "Status"].map((h) => (
                      <th key={h} className="py-2.5 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.users.map((user) => (
                    <UserRow key={user._id} user={user} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
