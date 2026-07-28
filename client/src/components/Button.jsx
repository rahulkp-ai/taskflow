import clsx from "clsx";

const Button = ({
  label,
  type = "button",
  className = "",
  onClick,
  disabled = false,
  loading = false,
  icon: Icon,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        className
      )}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {label}
    </button>
  );
};

export default Button;
