import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCreateSubTaskMutation } from "../../redux/slices/api/taskApiSlice";
import Button from "../Button";
import ModalWrapper from "../ModalWrapper";
import Textbox from "../Textbox";

const AddSubTask = ({ open, setOpen, taskId, refetch }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [createSubTask, { isLoading }] = useCreateSubTaskMutation();

  const submitHandler = async (data) => {
    try {
      await createSubTask({ id: taskId, ...data }).unwrap();
      toast.success("Subtask added");
      reset();
      setOpen(false);
      refetch?.();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add subtask");
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-5">
        Add Subtask
      </h2>
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
        <Textbox
          label="Subtask Title"
          placeholder="Enter subtask title"
          name="title"
          register={register("title", { required: "Title is required" })}
          error={errors.title?.message}
        />
        <div className="grid grid-cols-2 gap-4">
          <Textbox
            type="date"
            label="Due Date"
            name="date"
            register={register("date")}
          />
          <Textbox
            label="Tag"
            placeholder="e.g. urgent, backend"
            name="tag"
            register={register("tag")}
          />
        </div>
        <div className="flex gap-3 pt-2">
          <Button
            label="Cancel"
            onClick={() => setOpen(false)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 justify-center"
          />
          <Button
            type="submit"
            label={isLoading ? "Adding..." : "Add Subtask"}
            loading={isLoading}
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white justify-center"
          />
        </div>
      </form>
    </ModalWrapper>
  );
};

export default AddSubTask;
