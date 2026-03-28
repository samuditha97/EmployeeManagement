import { useEffect, useState } from "react";
import { getEmployees, deleteEmployee } from "../services/employeeService";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import EmptyState from "../components/EmptyState";
import ConfirmButton from "../components/ConfirmButton";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  const loadEmployees = async (page = 1) => {
    try {
      const res = await getEmployees(page, 10);
      const data = res.data?.data;

      setEmployees(data?.items ?? []);
      setPageNumber(data?.pageNumber ?? 1);
      setTotalPages(data?.totalPages ?? 0);
    } catch (error) {
      console.error("Failed to load employees:", error);
      setEmployees([]);
      setPageNumber(1);
      setTotalPages(0);
    }
  };

  useEffect(() => {
    loadEmployees(1);
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteEmployee(id);

      const nextPage =
        employees.length === 1 && pageNumber > 1 ? pageNumber - 1 : pageNumber;

      loadEmployees(nextPage);
    } catch (error) {
      console.error("Failed to delete employee:", error);
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    loadEmployees(page);
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <PageHeader
        title="Employees"
        subtitle="Manage employee records"
        buttonText="Add Employee"
        onButtonClick={() => navigate("/employees/add")}
      />

      <DataTable
        columns={[
          "ID",
          "First Name",
          "Last Name",
          "Email",
          "DOB",
          "Age",
          "Salary",
          "Department",
          "Actions",
        ]}
      >
        {(employees ?? []).length > 0 ? (
          employees.map((employee) => (
            <tr key={employee.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 text-slate-700">{employee.id}</td>
              <td className="px-4 py-3 text-slate-700">{employee.firstName}</td>
              <td className="px-4 py-3 text-slate-700">{employee.lastName}</td>
              <td className="px-4 py-3 text-slate-700">{employee.emailAddress}</td>
              <td className="px-4 py-3 text-slate-700">
                {employee.dateOfBirth?.split("T")[0]}
              </td>
              <td className="px-4 py-3 text-slate-700">{employee.age}</td>
              <td className="px-4 py-3 text-slate-700">
                Rs. {Number(employee.salary).toLocaleString()}
              </td>
              <td className="px-4 py-3 text-slate-700">{employee.departmentName}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/employees/edit/${employee.id}`)}
                    className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600"
                  >
                    Edit
                  </button>

                  <ConfirmButton
                    text="Delete"
                    message="Are you sure you want to delete this employee?"
                    onConfirm={() => handleDelete(employee.id)}
                    className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
                  />
                </div>
              </td>
            </tr>
          ))
        ) : (
          <EmptyState message="No employees found." colSpan={9} />
        )}
      </DataTable>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => handlePageChange(pageNumber - 1)}
            disabled={pageNumber === 1}
            className="rounded-lg border border-slate-300 px-3 py-1 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`rounded-lg px-3 py-1 text-sm ${
                page === pageNumber
                  ? "bg-slate-900 text-white"
                  : "border border-slate-300 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(pageNumber + 1)}
            disabled={pageNumber === totalPages}
            className="rounded-lg border border-slate-300 px-3 py-1 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default EmployeeList;