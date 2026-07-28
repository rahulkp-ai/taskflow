import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useGetAllTaskQuery, useUpdateTaskStageMutation } from "../redux/slices/api/taskApiSlice";
import Loading from "../components/Loading";
import Title from "../components/Title";
import Tabs from "../components/Tabs";
import Button from "../components/Button";
import { AddTask, BoardView, TaskCard } from "../components/tasks";
import Table from "../components/Table";

const TABS = [{ title: "Board View" }, { title: "List View" }];

const Tasks = () => {
  const params = useParams();
  const { user } = useSelector((state) => state.auth);
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const status = params?.status || "";

  const { data, isLoading, refetch } = useGetAllTaskQuery({
    strQuery: status,
    isTrashed: false,
    search: "",
  });

  const [updateStage] = useUpdateTaskStageMutation();

  const handleStageChange = async (id, stage) => {
    try {
      await updateStage({ id, stage }).unwrap();
      toast.success("Task stage updated");
      refetch();
    } catch {
      toast.error("Failed to update stage");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Title
          title={
            status
              ? `${status.charAt(0).toUpperCase() + status.slice(1)} Tasks`
              : "All Tasks"
          }
        />
        {user?.isAdmin && (
          <Button
            label="New Task"
            icon={FiPlus}
            onClick={() => { setEditTask(null); setOpen(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          />
        )}
      </div>

      <Tabs tabs={TABS} setSelected={setSelected} selected={selected} />

      {isLoading ? (
        <Loading />
      ) : (
        <>
          {selected === 0 ? (
            <BoardView
              tasks={data?.tasks}
              onStageChange={handleStageChange}
              onEdit={(task) => { setEditTask(task); setOpen(true); }}
              refetch={refetch}
            />
          ) : (
            <Table
              tasks={data?.tasks}
              onEdit={(task) => { setEditTask(task); setOpen(true); }}
              refetch={refetch}
            />
          )}
        </>
      )}

      <AddTask
        open={open}
        setOpen={setOpen}
        taskData={editTask}
        refetch={refetch}
      />
    </div>
  );
};

export default Tasks;
