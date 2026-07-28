import clsx from "clsx";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { FiPlus } from "react-icons/fi";
import { MdCheck } from "react-icons/md";
import { useSelector } from "react-redux";
import {
  useGetSingleTaskQuery,
  usePostActivityMutation,
  useUpdateSubTaskStageMutation,
} from "../redux/slices/api/taskApiSlice";
import Loading from "../components/Loading";
import Tabs from "../components/Tabs";
import { AddSubTask } from "../components/tasks";
import { UserAvatarGroup } from "../components/UserAvatar";
import Button from "../components/Button";
import { PRIORITY_STYLES, TASK_TYPE, dateTimeAgo, formatDate, getInitials } from "../utils";

const ACTIVITY_TYPES = ["assigned", "started", "in progress", "bug", "completed", "commented"];
const TABS = [{ title: "Task Detail" }, { title: "Activities / Timeline" }];

const ActivityIcon = ({ type }) => {
  const colors = {
    assigned: "bg-blue-500",
    started: "bg-yellow-500",
    "in progress": "bg-purple-500",
    bug: "bg-red-500",
    completed: "bg-green-500",
    commented: "bg-gray-500",
  };
  return (
    <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold", colors[type] || "bg-gray-400")}>
      {type[0].toUpperCase()}
    </div>
  );
};

const TaskDetail = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [selectedTab, setSelectedTab] = useState(0);
  const [activityType, setActivityType] = useState("commented");
  const [activityText, setActivityText] = useState("");
  const [openSubTask, setOpenSubTask] = useState(false);

  const { data, isLoading, refetch } = useGetSingleTaskQuery(id);
  const [postActivity, { isLoading: posting }] = usePostActivityMutation();
  const [updateSubTaskStage] = useUpdateSubTaskStageMutation();

  const task = data?.task;

  const handleActivitySubmit = async () => {
    if (!activityText.trim()) return toast.error("Activity text is required");
    try {
      await postActivity({ id, type: activityType, activity: activityText }).unwrap();
      toast.success("Activity posted");
      setActivityText("");
      refetch();
    } catch {
      toast.error("Failed to post activity");
    }
  };

  const handleSubTaskToggle = async (subTaskId, currentStatus) => {
    try {
      await updateSubTaskStage({ taskId: id, subTaskId, status: !currentStatus }).unwrap();
      refetch();
    } catch {
      toast.error("Failed to update subtask");
    }
  };

  if (isLoading) return <Loading />;
  if (!task) return <div className="text-center py-16 text-gray-500">Task not found</div>;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="card p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className={clsx("w-3 h-3 rounded-full", TASK_TYPE[task.stage])} />
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 capitalize">
                {task.stage}
              </span>
              <span className="text-gray-300 dark:text-gray-600">·</span>
              <span className={clsx("text-xs font-medium capitalize", PRIORITY_STYLES[task.priority])}>
                {task.priority} priority
              </span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{task.title}</h1>
            {task.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{task.description}</p>
            )}
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-xs text-gray-400">Due</p>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{formatDate(task.date)}</p>
          </div>
        </div>

        {/* Team */}
        {task.team?.length > 0 && (
          <div className="mt-4 flex items-center gap-3">
            <span className="text-xs text-gray-400">Assigned to</span>
            <UserAvatarGroup users={task.team} max={5} />
            <div className="flex gap-1 flex-wrap">
              {task.team.map((member) => (
                <span key={member._id} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                  {member.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        {task.links?.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-gray-400 mb-1">Links</p>
            <div className="flex flex-wrap gap-2">
              {task.links.map((link, i) => (
                <a key={i} href={link} target="_blank" rel="noreferrer"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline truncate max-w-xs">
                  {link}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <Tabs tabs={TABS} setSelected={setSelectedTab} selected={selectedTab} />

      {selectedTab === 0 ? (
        /* Subtasks */
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800 dark:text-gray-100">
              Subtasks ({task.subTasks?.length || 0})
            </h2>
            <Button
              label="Add Subtask"
              icon={FiPlus}
              onClick={() => setOpenSubTask(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs py-1.5 px-3"
            />
          </div>

          {task.subTasks?.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-6">No subtasks yet</p>
          )}

          <div className="space-y-2">
            {task.subTasks?.map((sub) => (
              <div key={sub._id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                <button
                  onClick={() => handleSubTaskToggle(sub._id, sub.isCompleted)}
                  className={clsx(
                    "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                    sub.isCompleted
                      ? "bg-green-500 border-green-500 text-white"
                      : "border-gray-300 dark:border-gray-600 hover:border-green-400"
                  )}
                >
                  {sub.isCompleted && <MdCheck size={12} />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={clsx("text-sm font-medium", sub.isCompleted ? "line-through text-gray-400" : "text-gray-800 dark:text-gray-200")}>
                    {sub.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {sub.date && (
                      <span className="text-xs text-gray-400">{formatDate(sub.date)}</span>
                    )}
                    {sub.tag && (
                      <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-1.5 py-0.5 rounded-full">
                        {sub.tag}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Activities */
        <div className="card p-5">
          <div className="space-y-4 mb-6">
            {task.activities?.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No activities yet</p>
            )}
            {task.activities?.map((act, i) => (
              <div key={i} className="flex gap-3">
                <ActivityIcon type={act.type} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      {act.by?.name || "System"}
                    </span>
                    <span className="text-xs text-gray-400">{dateTimeAgo(act.date)}</span>
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full capitalize">
                      {act.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{act.activity}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Post new activity */}
          <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                {getInitials(user?.name)}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Post Activity
              </span>
            </div>
            <select
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
              className="input-field mb-2 text-sm"
            >
              {ACTIVITY_TYPES.map((t) => (
                <option key={t} value={t} className="capitalize">
                  {t}
                </option>
              ))}
            </select>
            <textarea
              rows={3}
              value={activityText}
              onChange={(e) => setActivityText(e.target.value)}
              placeholder="Add a comment or update..."
              className="input-field resize-none mb-2 text-sm"
            />
            <Button
              label={posting ? "Posting..." : "Post Activity"}
              onClick={handleActivitySubmit}
              loading={posting}
              disabled={posting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            />
          </div>
        </div>
      )}

      <AddSubTask
        open={openSubTask}
        setOpen={setOpenSubTask}
        taskId={id}
        refetch={refetch}
      />
    </div>
  );
};

export default TaskDetail;
