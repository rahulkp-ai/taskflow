import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { MdTaskAlt } from "react-icons/md";
import { useLoginMutation } from "../redux/slices/api/authApiSlice";
import { setCredentials } from "../redux/slices/authSlice";
import Button from "../components/Button";
import Textbox from "../components/Textbox";

const Login = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const submitHandler = async (data) => {
    try {
      const result = await login(data).unwrap();
      dispatch(setCredentials(result));
      toast.success(`Welcome back, ${result.name}!`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg mb-3">
            <MdTaskAlt className="text-white text-3xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            TaskFlow
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your tasks efficiently
          </p>
        </div>

        {/* Card */}
        <div className="card p-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-1">
            Sign in
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Enter your credentials to access your account
          </p>

          <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
            <Textbox
              placeholder="you@example.com"
              type="email"
              label="Email address"
              name="email"
              register={register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              error={errors.email?.message}
            />

            <Textbox
              placeholder="Your password"
              type="password"
              label="Password"
              name="password"
              register={register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              error={errors.password?.message}
            />

            <Button
              type="submit"
              label={isLoading ? "Signing in..." : "Sign in"}
              loading={isLoading}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-center py-2.5 text-base"
            />
          </form>

          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
            Contact your administrator to get access
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
