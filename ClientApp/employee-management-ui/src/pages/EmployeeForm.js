import { useEffect, useState } from "react";
import { addEmployee, getEmployeeById, updateEmployee } from "../services/employeeService";
import { getDepartments } from "../services/departmentService";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import FormInput from "../components/FormInput";
import FormSelect from "../components/FormSelect";

function EmployeeForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [salary, setSalary] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [departments, setDepartments] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    loadDepartments();
    if (id) loadEmployee();
  }, [id]);

const loadDepartments = async () => {
  try {
    const res = await getDepartments();
    setDepartments(res.data?.data ?? []);
  } catch (error) {
    console.error("Failed to load departments:", error);
    setDepartments([]);
  }
};

const loadEmployee = async () => {
  try {
    const res = await getEmployeeById(id);
    const emp = res.data?.data;

    if (!emp) return;

    setFirstName(emp.firstName ?? "");
    setLastName(emp.lastName ?? "");
    setEmailAddress(emp.emailAddress ?? "");
    setDateOfBirth(emp.dateOfBirth ? emp.dateOfBirth.split("T")[0] : "");
    setSalary(emp.salary ?? "");
    setDepartmentId(emp.departmentId ? emp.departmentId.toString() : "");
  } catch (error) {
    console.error("Failed to load employee:", error);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      firstName,
      lastName,
      emailAddress,
      dateOfBirth,
      salary: parseFloat(salary),
      departmentId: parseInt(departmentId),
    };

    if (id) {
      await updateEmployee(id, payload);
    } else {
      await addEmployee(payload);
    }

    navigate("/employees");
  };

  return (
    <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <PageHeader
        title={id ? "Edit Employee" : "Add Employee"}
        subtitle="Fill in the employee details below"
      />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <FormInput
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          placeholder="Enter first name"
        />

        <FormInput
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          placeholder="Enter last name"
        />

        <FormInput
          label="Email Address"
          type="email"
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
          required
          placeholder="Enter email address"
        />

        <FormInput
          label="Date of Birth"
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          required
        />

        <FormInput
          label="Salary"
          type="number"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          required
          placeholder="Enter salary"
        />

        <FormSelect
          label="Department"
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
          options={departments}
          required
          placeholder="Select Department"
        />

        <div className="flex gap-3 md:col-span-2">
          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => navigate("/employees")}
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmployeeForm;