import { useEffect, useState } from "react";
import { getDepartments, deleteDepartment } from "../services/departmentService";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import EmptyState from "../components/EmptyState";
import ConfirmButton from "../components/ConfirmButton";

function DepartmentList() {
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

const loadDepartments = async () => {
  try {
    const res = await getDepartments();
    setDepartments(res.data?.data ?? []);
  } catch (error) {
    console.error("Failed to load departments:", error);
    setDepartments([]);
  }
};

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleDelete = async (id) => {
    await deleteDepartment(id);
    loadDepartments();
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <PageHeader
        title="Departments"
        subtitle="Manage department records"
        buttonText="Add Department"
        onButtonClick={() => navigate("/departments/add")}
      />

      <DataTable columns={["ID", "Department Code", "Department Name", "Actions"]}>
        {departments.length > 0 ? (
          departments.map((department) => (
            <tr key={department.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 text-slate-700">{department.id}</td>
              <td className="px-4 py-3 text-slate-700">{department.departmentCode}</td>
              <td className="px-4 py-3 text-slate-700">{department.departmentName}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/departments/edit/${department.id}`)}
                    className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600"
                  >
                    Edit
                  </button>

                  <ConfirmButton
                    text="Delete"
                    message="Are you sure you want to delete this department?"
                    onConfirm={() => handleDelete(department.id)}
                    className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
                  />
                </div>
              </td>
            </tr>
          ))
        ) : (
          <EmptyState message="No departments found." colSpan={4} />
        )}
      </DataTable>
    </div>
  );
}

export default DepartmentList;