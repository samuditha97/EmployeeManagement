using EmployeeManagement.API.Models;
using Microsoft.Data.SqlClient;
using System.Data;

namespace EmployeeManagement.API.Repositories
{
    public class DepartmentRepository
    {
        private readonly string _connectionString;

        public DepartmentRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")!;
        }

        public List<Department> GetAll()
        {
            var departments = new List<Department>();

            using SqlConnection connection = new SqlConnection(_connectionString);
            using SqlCommand command = new SqlCommand("SELECT Id, DepartmentCode, DepartmentName FROM Departments", connection);

            connection.Open();
            using SqlDataReader reader = command.ExecuteReader();

            while (reader.Read())
            {
                departments.Add(new Department
                {
                    Id = Convert.ToInt32(reader["Id"]),
                    DepartmentCode = reader["DepartmentCode"].ToString() ?? string.Empty,
                    DepartmentName = reader["DepartmentName"].ToString() ?? string.Empty
                });
            }

            return departments;
        }

        public Department? GetById(int id)
        {
            Department? department = null;

            using SqlConnection connection = new SqlConnection(_connectionString);
            using SqlCommand command = new SqlCommand("SELECT Id, DepartmentCode, DepartmentName FROM Departments WHERE Id = @Id", connection);

            command.Parameters.AddWithValue("@Id", id);

            connection.Open();
            using SqlDataReader reader = command.ExecuteReader();

            if (reader.Read())
            {
                department = new Department
                {
                    Id = Convert.ToInt32(reader["Id"]),
                    DepartmentCode = reader["DepartmentCode"].ToString() ?? string.Empty,
                    DepartmentName = reader["DepartmentName"].ToString() ?? string.Empty
                };
            }

            return department;
        }

        public int Add(Department department)
        {
            using SqlConnection connection = new SqlConnection(_connectionString);
            using SqlCommand command = new SqlCommand(
                @"INSERT INTO Departments (DepartmentCode, DepartmentName)
                  VALUES (@DepartmentCode, @DepartmentName)", connection);

            command.Parameters.AddWithValue("@DepartmentCode", department.DepartmentCode);
            command.Parameters.AddWithValue("@DepartmentName", department.DepartmentName);

            connection.Open();
            return command.ExecuteNonQuery();
        }

        public int Update(int id, Department department)
        {
            using SqlConnection connection = new SqlConnection(_connectionString);
            using SqlCommand command = new SqlCommand(
                @"UPDATE Departments
                  SET DepartmentCode = @DepartmentCode,
                      DepartmentName = @DepartmentName
                  WHERE Id = @Id", connection);

            command.Parameters.AddWithValue("@Id", id);
            command.Parameters.AddWithValue("@DepartmentCode", department.DepartmentCode);
            command.Parameters.AddWithValue("@DepartmentName", department.DepartmentName);

            connection.Open();
            return command.ExecuteNonQuery();
        }

        public int Delete(int id)
        {
            using SqlConnection connection = new SqlConnection(_connectionString);
            using SqlCommand command = new SqlCommand("DELETE FROM Departments WHERE Id = @Id", connection);

            command.Parameters.AddWithValue("@Id", id);

            connection.Open();
            return command.ExecuteNonQuery();
        }
    }
}