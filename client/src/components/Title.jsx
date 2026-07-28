const Title = ({ title, className = "" }) => (
  <h2 className={`text-xl font-semibold text-gray-800 dark:text-gray-100 ${className}`}>
    {title}
  </h2>
);

export default Title;
