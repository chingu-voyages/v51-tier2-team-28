export default function IconButton({ children, icon, onClick }) {
  const iconType = `fa-${icon}`;

  return (
    <button
      onClick={onClick}
      className="text-slate mx-auto flex h-[64px] w-[96px] flex-col items-center rounded-lg py-[0.16rem] transition-all hover:bg-white hover:text-primary/90"
    >
      <i className={`fa-solid ${iconType} text-2xl`}></i>
      <div className="text-[18px] font-semibold">{children}</div>
    </button>
  );
}
