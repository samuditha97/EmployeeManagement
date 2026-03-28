using EmployeeManagement.API.Models;
using EmployeeManagement.API.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;

namespace EmployeeManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly EmployeeRepository _repository;

        public EmployeeController(EmployeeRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public IActionResult GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            if (pageNumber <= 0)
                return BadRequest(ApiResponse<string>.FailResponse("Page number must be greater than 0."));

            if (pageSize <= 0 || pageSize > 100)
                return BadRequest(ApiResponse<string>.FailResponse("Page size must be between 1 and 100."));

            var result = _repository.GetAll(pageNumber, pageSize);
            return Ok(ApiResponse<PagedResult<Employee>>.SuccessResponse(result, "Employees retrieved successfully."));
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var employee = _repository.GetById(id);

            if (employee == null)
                return NotFound(ApiResponse<string>.FailResponse("Employee not found."));

            return Ok(ApiResponse<Employee>.SuccessResponse(employee, "Employee retrieved successfully."));
        }

        [HttpPost]
        public IActionResult Add([FromBody] Employee emp)
        {
            var validationMessage = ValidateEmployee(emp);
            if (!string.IsNullOrEmpty(validationMessage))
                return BadRequest(ApiResponse<string>.FailResponse(validationMessage));

            _repository.Add(emp);
            return Ok(ApiResponse<string>.SuccessResponse(null, "Employee added successfully."));
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Employee emp)
        {
            var validationMessage = ValidateEmployee(emp);
            if (!string.IsNullOrEmpty(validationMessage))
                return BadRequest(ApiResponse<string>.FailResponse(validationMessage));

            var rows = _repository.Update(id, emp);

            if (rows == 0)
                return NotFound(ApiResponse<string>.FailResponse("Employee not found."));

            return Ok(ApiResponse<string>.SuccessResponse(null, "Employee updated successfully."));
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var rows = _repository.Delete(id);

            if (rows == 0)
                return NotFound(ApiResponse<string>.FailResponse("Employee not found."));

            return Ok(ApiResponse<string>.SuccessResponse(null, "Employee deleted successfully."));
        }

        private string ValidateEmployee(Employee emp)
        {
            if (string.IsNullOrWhiteSpace(emp.FirstName))
                return "First name is required.";

            if (string.IsNullOrWhiteSpace(emp.LastName))
                return "Last name is required.";

            if (string.IsNullOrWhiteSpace(emp.EmailAddress))
                return "Email address is required.";

            if (!Regex.IsMatch(emp.EmailAddress, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
                return "Invalid email address format.";

            if (emp.DateOfBirth == default)
                return "Date of birth is required.";

            if (emp.DateOfBirth > DateTime.Today)
                return "Date of birth cannot be in the future.";

            if (emp.Salary <= 0)
                return "Salary must be greater than 0.";

            if (emp.DepartmentId <= 0)
                return "Department is required.";

            return string.Empty;
        }
    }
}