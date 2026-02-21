export default function SchemeSectionComponents({ label, color }) {
  const colors = {
    emerald: "border-emerald-300 text-emerald-800 bg-emerald-100",
    blue: "border-blue-300 text-blue-800 bg-blue-100",
    violet: "border-violet-300 text-violet-800 bg-violet-100",
    green: "border-green-300 text-green-800 bg-green-100",
    amber: "border-amber-300 text-amber-800 bg-amber-100",
  };
  
  return (
    <span className={`px-3.5 py-1.5 rounded-full border text-[13px] font-semibold ${colors[color] || colors.emerald}`}>
      {label}
    </span>
  );
}