import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const linkClass = (path) =>
    `rounded-lg px-4 py-2 text-sm font-medium transition ${
      location.pathname.startsWith(path)
        ? "bg-white text-slate-900"
        : "text-slate-200 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <nav className="border-b border-slate-800 bg-slate-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-xl font-bold text-white">HRMS Pro</h1>
          <p className="text-xs text-slate-400">ABC Company Pvt Ltd</p>
        </div>

        <div className="flex gap-3">
          <Link to="/departments" className={linkClass("/departments")}>
            Departments
          </Link>
          <Link to="/employees" className={linkClass("/employees")}>
            Employees
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;