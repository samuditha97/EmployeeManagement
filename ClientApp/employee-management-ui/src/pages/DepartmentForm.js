import { useEffect, useState } from "react";
import { addDepartment, getDepartmentById, updateDepartment } from "../services/departmentService";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import FormInput from "../components/FormInput";

function DepartmentForm() {
  const [departmentCode, setDepartmentCode] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      loadDepartment();
    }
  }, [id]);

const loadDepartment = async () => {
  try {
    const res = await getDepartmentById(id);
    const department = res.data?.data;

    if (!department) return;

    setDepartmentCode(department.departmentCode ?? "");
    setDepartmentName(department.departmentName ?? "");
  } catch (error) {
    console.error("Failed to load department:", error);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { departmentCode, departmentName };

    if (id) {
      await updateDepartment(id, payload);
    } else {
      await addDepartment(payload);
    }

    navigate("/departments");
  };

  return (
    <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <PageHeader
        title={id ? "Edit Department" : "Add Department"}
        subtitle="Fill in the department details below"
      />

      <form onSubmit={handleSubmit} className="space-y-5">
        <FormInput
          label="Department Code"
          value={departmentCode}
          onChange={(e) => setDepartmentCode(e.target.value)}
          required
          placeholder="Enter department code"
        />

        <FormInput
          label="Department Name"
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
          required
          placeholder="Enter department name"
        />

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => navigate("/departments")}
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default DepartmentForm;