import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRegisterMutation } from "../redux/slices/api/authApiSlice";
import Button from "./Button";
import ModalWrapper from "./ModalWrapper";
import Textbox from "./Textbox";

const AddUser = ({ open, setOpen, refetch }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [registerUser, { isLoading }] = useRegisterMutation();

  const submitHandler = async (data) => {
    try {
      await registerUser({ ...data, isAdmin: false }).unwrap();
      toast.success("User added successfully");
      reset();
      setOpen(false);
      refetch?.();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add user");
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-5">
        Add Team Member
      </h2>
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
        <Textbox
          label="Full Name"
          placeholder="John Doe"
          name="name"
          register={register("name", { required: "Name is required" })}
          error={errors.name?.message}
        />
        <Textbox
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          name="email"
          register={register("email", { required: "Email is required" })}
          error={errors.email?.message}
        />
        <Textbox
          label="Title"
          placeholder="e.g. Senior Developer"
          name="title"
          register={register("title", { required: "Title is required" })}
          error={errors.title?.message}
        />
        <Textbox
          label="Role"
          placeholder="e.g. Engineer, Designer"
          name="role"
          register={register("role", { required: "Role is required" })}
          error={errors.role?.message}
        />
        <Textbox
          label="Password"
          type="password"
          placeholder="Minimum 6 characters"
          name="password"
          register={register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Minimum 6 characters" },
          })}
          error={errors.password?.message}
        />
        <div className="flex gap-3 pt-2">
          <Button
            label="Cancel"
            onClick={() => setOpen(false)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 justify-center"
          />
          <Button
            type="submit"
            label={isLoading ? "Adding..." : "Add User"}
            loading={isLoading}
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white justify-center"
          />
        </div>
      </form>
    </ModalWrapper>
  );
};

export default AddUser;
