"use client";
 
import { useEffect, useRef, useState, useMemo } from "react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";
 
interface Option {
  label: string;
  value: string;
}
 
interface MultiSelectDropdownProps {
  label?: string;
  options: Option[];
  value: string[];               // selected values
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
}
 
export function MultiSelectDropdown({
  label,
  options,
  value,
  onChange,
  placeholder = "Select options",
  className,
}: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
 
  /* ---------------- CLOSE ON OUTSIDE CLICK ---------------- */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
 
  /* ---------------- FILTER OPTIONS ---------------- */
  const filteredOptions = useMemo(() => {
    return options.filter((o) =>
      o.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);
 
  /* ---------------- TOGGLE SINGLE ---------------- */
  const toggleValue = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };
 
  /* ---------------- SELECT ALL (FILTERED) ---------------- */
  const handleSelectAll = () => {
    const filteredValues = filteredOptions.map((o) => o.value);
    const merged = Array.from(new Set([...value, ...filteredValues]));
    onChange(merged);
  };
 
  /* ---------------- CLEAR ALL (FILTERED) ---------------- */
  const handleClearAll = () => {
    const filteredValues = filteredOptions.map((o) => o.value);
    onChange(value.filter((v) => !filteredValues.includes(v)));
  };
 
  const allFilteredSelected =
    filteredOptions.length > 0 &&
    filteredOptions.every((o) => value.includes(o.value));
 
  /* ---------------- RENDER ---------------- */
  return (
    <div ref={ref} className={cn("relative", className)}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
 
      {/* -------- TRIGGER -------- */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="
          w-full flex items-center justify-between
          px-3 py-2 border border-gray-300 rounded-lg
          bg-white text-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500
        "
      >
        <span className="truncate text-left">
          {value.length > 0 ? value.join(", ") : placeholder}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>
 
      {/* -------- DROPDOWN -------- */}
      {open && (
        <div className="
          absolute z-50 mt-1 w-full
          bg-white border border-gray-200 rounded-lg shadow-lg
        ">
 
          {/* -------- ACTION BAR -------- */}
          <div className="flex items-center justify-between px-3 py-2 border-b bg-gray-50 text-sm">
            <button
              onClick={handleSelectAll}
              disabled={allFilteredSelected}
              className="
                text-blue-600 hover:underline
                disabled:text-gray-400 disabled:cursor-not-allowed
              "
            >
              Select All
            </button>
 
            <button
              onClick={handleClearAll}
              disabled={value.length === 0}
              className="
                text-red-600 hover:underline
                disabled:text-gray-400 disabled:cursor-not-allowed
              "
            >
              Clear All
            </button>
          </div>
 
          {/* -------- SEARCH -------- */}
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full pl-8 pr-2 py-1.5 text-sm
                  border border-gray-300 rounded-md
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                "
              />
            </div>
          </div>
 
          {/* -------- OPTIONS -------- */}
          <div className="max-h-56 overflow-auto p-2">
            {filteredOptions.length === 0 && (
              <p className="text-sm text-gray-500 px-2 py-1">
                No options found
              </p>
            )}
 
            {filteredOptions.map((opt) => (
              <label
                key={opt.value}
                className="
                  flex items-center gap-2 px-2 py-1.5
                  rounded cursor-pointer
                  hover:bg-blue-50
                "
              >
                <input
                  type="checkbox"
                  checked={value.includes(opt.value)}
                  onChange={() => toggleValue(opt.value)}
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="text-sm text-gray-700">
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}