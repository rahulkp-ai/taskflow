import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useChangePasswordMutation } from "../redux/slices/api/userApiSlice";
import Button from "./Button";
import ModalWrapper from "./ModalWrapper";
import Textbox from "./Textbox";

const ChangePassword = ({ open, setOpen }) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const submitHandler = async ({ password }) => {
    try {
      await changePassword({ password }).unwrap();
      toast.success("Password changed successfully");
      reset();
      setOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to change password");
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-5">
        Change Password
      </h2>
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
        <Textbox
          label="New Password"
          type="password"
          placeholder="Enter new password"
          name="password"
          register={register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Minimum 6 characters" },
          })}
          error={errors.password?.message}
        />
        <Textbox
          label="Confirm Password"
          type="password"
          placeholder="Confirm new password"
          name="confirmPassword"
          register={register("confirmPassword", {
            required: "Please confirm your password",
            validate: (val) => val === watch("password") || "Passwords do not match",
          })}
          error={errors.confirmPassword?.message}
        />
        <div className="flex gap-3 pt-2">
          <Button
            label="Cancel"
            onClick={() => { setOpen(false); reset(); }}
            className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 justify-center"
          />
          <Button
            type="submit"
            label={isLoading ? "Saving..." : "Update Password"}
            loading={isLoading}
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white justify-center"
          />
        </div>
      </form>
    </ModalWrapper>
  );
};

export default ChangePassword;
