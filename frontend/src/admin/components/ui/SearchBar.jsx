import { Search } from "lucide-react";

const SearchBar = ({
  value,
  onChange,
  placeholder = "Search",
  className = "",
}) => {
  return (
    <label
      className={`flex min-w-[220px] items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-300 transition focus-within:border-cyan-400/40 focus-within:bg-cyan-400/5 ${className}`}
    >
      <Search size={18} className="text-slate-500" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
      />
    </label>
  );
};

export default SearchBar;
