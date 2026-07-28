import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "../../redux/slices/api/taskApiSlice";
import { useGetTeamListQuery } from "../../redux/slices/api/userApiSlice";
import Button from "../Button";
import ModalWrapper from "../ModalWrapper";
import SelectList from "../SelectList";
import Textbox from "../Textbox";

const LISTS = ["todo", "in progress", "completed"];
const PRIORITY = ["high", "medium", "normal", "low"];

const AddTask = ({ open, setOpen, taskData, refetch }) => {
  const [stage, setStage] = useState(taskData?.stage || "todo");
  const [priority, setPriority] = useState(taskData?.priority || "normal");
  const [selectedTeam, setSelectedTeam] = useState(taskData?.team || []);
  const [teamSearch, setTeamSearch] = useState("");

  const { data: teamData } = useGetTeamListQuery({ search: teamSearch });
  const [createTask, { isLoading: creating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: updating }] = useUpdateTaskMutation();

  const isLoading = creating || updating;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: taskData?.title || "",
      date: taskData?.date
        ? new Date(taskData.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      description: taskData?.description || "",
      links: taskData?.links?.join(", ") || "",
    },
  });

  useEffect(() => {
    if (taskData) {
      setStage(taskData.stage);
      setPriority(taskData.priority);
      setSelectedTeam(taskData.team || []);
    } else {
      setStage("todo");
      setPriority("normal");
      setSelectedTeam([]);
    }
  }, [taskData, open]);

  const toggleTeamMember = (member) => {
    setSelectedTeam((prev) => {
      const exists = prev.find((u) => u._id === member._id);
      return exists ? prev.filter((u) => u._id !== member._id) : [...prev, member];
    });
  };

  const submitHandler = async (data) => {
    try {
      const payload = {
        ...data,
        stage,
        priority,
        team: selectedTeam.map((u) => u._id),
      };

      if (taskData?._id) {
        await updateTask({ id: taskData._id, ...payload }).unwrap();
        toast.success("Task updated successfully");
      } else {
        await createTask(payload).unwrap();
        toast.success("Task created successfully");
      }

      reset();
      setOpen(false);
      refetch?.();
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-5">
        {taskData ? "Edit Task" : "Create New Task"}
      </h2>

      <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
        <Textbox
          label="Task Title"
          placeholder="Enter task title"
          name="title"
          register={register("title", { required: "Title is required" })}
          error={errors.title?.message}
        />

        <div className="grid grid-cols-2 gap-4">
          <SelectList
            label="Stage"
            lists={LISTS}
            selected={stage}
            setSelected={setStage}
          />
          <SelectList
            label="Priority"
            lists={PRIORITY}
            selected={priority}
            setSelected={setPriority}
          />
        </div>

        <Textbox
          type="date"
          label="Due Date"
          name="date"
          register={register("date", { required: "Due date is required" })}
          error={errors.date?.message}
        />

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            rows={3}
            placeholder="Task description (optional)"
            {...register("description")}
            className="input-field mt-1 resize-none"
          />
        </div>

        <Textbox
          label="Links (comma separated)"
          placeholder="https://example.com, https://docs.com"
          name="links"
          register={register("links")}
        />

        {/* Team selection */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Assign Team
          </label>
          <input
            type="text"
            placeholder="Search team members..."
            value={teamSearch}
            onChange={(e) => setTeamSearch(e.target.value)}
            className="input-field mt-1 mb-2"
          />
          <div className="max-h-36 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg divide-y divide-gray-100 dark:divide-gray-700">
            {teamData?.map((member) => {
              const isSelected = selectedTeam.find((u) => u._id === member._id);
              return (
                <div
                  key={member._id}
                  onClick={() => toggleTeamMember(member)}
                  className={`flex items-center justify-between px-3 py-2 cursor-pointer transition-colors text-sm ${
                    isSelected
                      ? "bg-blue-50 dark:bg-blue-900/30"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{member.name}</p>
                    <p className="text-xs text-gray-400">{member.title}</p>
                  </div>
                  {isSelected && (
                    <span className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-white text-[10px]">✓</span>
                  )}
                </div>
              );
            })}
            {!teamData?.length && (
              <p className="text-center text-sm text-gray-400 py-4">No members found</p>
            )}
          </div>
          {selectedTeam.length > 0 && (
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              {selectedTeam.length} member{selectedTeam.length > 1 ? "s" : ""} selected
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            label="Cancel"
            onClick={() => setOpen(false)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 justify-center"
          />
          <Button
            type="submit"
            label={isLoading ? "Saving..." : taskData ? "Update Task" : "Create Task"}
            loading={isLoading}
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white justify-center"
          />
        </div>
      </form>
    </ModalWrapper>
  );
};

export default AddTask;
