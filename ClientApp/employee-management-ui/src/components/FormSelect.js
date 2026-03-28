function FormSelect({
  label,
  value,
  onChange,
  options = [],
  required = false,
  placeholder = "Select",
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-800 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.departmentName}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FormSelect;