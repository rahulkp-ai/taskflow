import clsx from "clsx";
import { forwardRef } from "react";

const Textbox = forwardRef(
  ({ type = "text", placeholder, label, className = "", register, name, error }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1">
        {label && (
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          ref={ref}
          {...register}
          aria-invalid={error ? "true" : "false"}
          className={clsx(
            "input-field",
            error && "border-red-500 dark:border-red-500 focus:ring-red-500",
            className
          )}
        />
        {error && (
          <span className="text-xs text-red-500">{error}</span>
        )}
      </div>
    );
  }
);

Textbox.displayName = "Textbox";

export default Textbox;
