function PageHeader({ title, subtitle, buttonText, onButtonClick }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>

      {buttonText && onButtonClick && (
        <button
          onClick={onButtonClick}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}

export default PageHeader;