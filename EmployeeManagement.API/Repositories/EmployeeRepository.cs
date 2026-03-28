using EmployeeManagement.API.Models;
using Microsoft.Data.SqlClient;
using System.Text.RegularExpressions;

namespace EmployeeManagement.API.Repositories
{
    public class EmployeeRepository
    {
        private readonly string _connectionString;

        public EmployeeRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")!;
        }

        public PagedResult<Employee> GetAll(int pageNumber, int pageSize)
        {
            var employees = new List<Employee>();
            var totalRecords = 0;

            using SqlConnection connection = new SqlConnection(_connectionString);
            connection.Open();

            using (SqlCommand countCommand = new SqlCommand("SELECT COUNT(*) FROM Employees", connection))
            {
                totalRecords = Convert.ToInt32(countCommand.ExecuteScalar());
            }

            var offset = (pageNumber - 1) * pageSize;

            using SqlCommand command = new SqlCommand(@"
                SELECT e.Id, e.FirstName, e.LastName, e.EmailAddress,
                       e.DateOfBirth, e.Salary,
                       d.Id AS DepartmentId, d.DepartmentName
                FROM Employees e
                INNER JOIN Departments d ON e.DepartmentId = d.Id
                ORDER BY e.Id
                OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY
            ", connection);

            command.Parameters.AddWithValue("@Offset", offset);
            command.Parameters.AddWithValue("@PageSize", pageSize);

            using SqlDataReader reader = command.ExecuteReader();

            while (reader.Read())
            {
                var dob = Convert.ToDateTime(reader["DateOfBirth"]);

                employees.Add(new Employee
                {
                    Id = Convert.ToInt32(reader["Id"]),
                    FirstName = reader["FirstName"].ToString() ?? "",
                    LastName = reader["LastName"].ToString() ?? "",
                    EmailAddress = reader["EmailAddress"].ToString() ?? "",
                    DateOfBirth = dob,
                    Age = CalculateAge(dob),
                    Salary = Convert.ToDecimal(reader["Salary"]),
                    DepartmentId = Convert.ToInt32(reader["DepartmentId"]),
                    DepartmentName = reader["DepartmentName"].ToString() ?? ""
                });
            }

            return new PagedResult<Employee>
            {
                Items = employees,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalRecords = totalRecords,
                TotalPages = (int)Math.Ceiling(totalRecords / (double)pageSize)
            };
        }

        public Employee? GetById(int id)
        {
            Employee? employee = null;

            using SqlConnection connection = new SqlConnection(_connectionString);
            using SqlCommand command = new SqlCommand(@"
                SELECT e.Id, e.FirstName, e.LastName, e.EmailAddress,
                       e.DateOfBirth, e.Salary,
                       d.Id AS DepartmentId, d.DepartmentName
                FROM Employees e
                INNER JOIN Departments d ON e.DepartmentId = d.Id
                WHERE e.Id = @Id
            ", connection);

            command.Parameters.AddWithValue("@Id", id);

            connection.Open();
            using SqlDataReader reader = command.ExecuteReader();

            if (reader.Read())
            {
                var dob = Convert.ToDateTime(reader["DateOfBirth"]);

                employee = new Employee
                {
                    Id = Convert.ToInt32(reader["Id"]),
                    FirstName = reader["FirstName"].ToString() ?? "",
                    LastName = reader["LastName"].ToString() ?? "",
                    EmailAddress = reader["EmailAddress"].ToString() ?? "",
                    DateOfBirth = dob,
                    Age = CalculateAge(dob),
                    Salary = Convert.ToDecimal(reader["Salary"]),
                    DepartmentId = Convert.ToInt32(reader["DepartmentId"]),
                    DepartmentName = reader["DepartmentName"].ToString() ?? ""
                };
            }

            return employee;
        }

        public int Add(Employee emp)
        {
            using SqlConnection connection = new SqlConnection(_connectionString);
            using SqlCommand command = new SqlCommand(@"
                INSERT INTO Employees 
                (FirstName, LastName, EmailAddress, DateOfBirth, Salary, DepartmentId)
                VALUES 
                (@FirstName, @LastName, @Email, @DOB, @Salary, @DeptId)
            ", connection);

            command.Parameters.AddWithValue("@FirstName", emp.FirstName);
            command.Parameters.AddWithValue("@LastName", emp.LastName);
            command.Parameters.AddWithValue("@Email", emp.EmailAddress);
            command.Parameters.AddWithValue("@DOB", emp.DateOfBirth);
            command.Parameters.AddWithValue("@Salary", emp.Salary);
            command.Parameters.AddWithValue("@DeptId", emp.DepartmentId);

            connection.Open();
            return command.ExecuteNonQuery();
        }

        public int Update(int id, Employee emp)
        {
            using SqlConnection connection = new SqlConnection(_connectionString);
            using SqlCommand command = new SqlCommand(@"
                UPDATE Employees
                SET FirstName = @FirstName,
                    LastName = @LastName,
                    EmailAddress = @Email,
                    DateOfBirth = @DOB,
                    Salary = @Salary,
                    DepartmentId = @DeptId
                WHERE Id = @Id
            ", connection);

            command.Parameters.AddWithValue("@Id", id);
            command.Parameters.AddWithValue("@FirstName", emp.FirstName);
            command.Parameters.AddWithValue("@LastName", emp.LastName);
            command.Parameters.AddWithValue("@Email", emp.EmailAddress);
            command.Parameters.AddWithValue("@DOB", emp.DateOfBirth);
            command.Parameters.AddWithValue("@Salary", emp.Salary);
            command.Parameters.AddWithValue("@DeptId", emp.DepartmentId);

            connection.Open();
            return command.ExecuteNonQuery();
        }

        public int Delete(int id)
        {
            using SqlConnection connection = new SqlConnection(_connectionString);
            using SqlCommand command = new SqlCommand("DELETE FROM Employees WHERE Id = @Id", connection);

            command.Parameters.AddWithValue("@Id", id);

            connection.Open();
            return command.ExecuteNonQuery();
        }

        private int CalculateAge(DateTime dob)
        {
            var today = DateTime.Today;
            var age = today.Year - dob.Year;
            if (dob.Date > today.AddYears(-age)) age--;
            return age;
        }
    }
}