import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import DepartmentList from "./pages/DepartmentList";
import DepartmentForm from "./pages/DepartmentForm";
import EmployeeList from "./pages/EmployeeList";
import EmployeeForm from "./pages/EmployeeForm";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-100">
        <Navbar />

        <main className="mx-auto max-w-7xl px-6 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/departments" />} />
            <Route path="/departments" element={<DepartmentList />} />
            <Route path="/departments/add" element={<DepartmentForm />} />
            <Route path="/departments/edit/:id" element={<DepartmentForm />} />
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/employees/add" element={<EmployeeForm />} />
            <Route path="/employees/edit/:id" element={<EmployeeForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;