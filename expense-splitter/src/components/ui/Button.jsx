export default function Button({
  children,
  variant,
  onClick,
  className,
  type,
}) {
  const buttonStyles =
    variant === "small"
      ? "bg-accent text-white py-2 px-6 rounded-md hover:bg-secondary text-sm font-light"
      : "bg-accent text-white py-2 px-8 rounded-lg hover:bg-secondary";

  return (
    <button
      className={`${buttonStyles} ${className} transition-colors`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}
