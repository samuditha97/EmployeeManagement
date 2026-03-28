using EmployeeManagement.API.Models;
using EmployeeManagement.API.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly DepartmentRepository _repository;

        public DepartmentController(DepartmentRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var departments = _repository.GetAll();
            return Ok(ApiResponse<List<Department>>.SuccessResponse(departments, "Departments retrieved successfully."));
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var department = _repository.GetById(id);

            if (department == null)
                return NotFound(ApiResponse<string>.FailResponse("Department not found."));

            return Ok(ApiResponse<Department>.SuccessResponse(department, "Department retrieved successfully."));
        }

        [HttpPost]
        public IActionResult Add([FromBody] Department department)
        {
            if (string.IsNullOrWhiteSpace(department.DepartmentCode))
                return BadRequest(ApiResponse<string>.FailResponse("Department code is required."));

            if (string.IsNullOrWhiteSpace(department.DepartmentName))
                return BadRequest(ApiResponse<string>.FailResponse("Department name is required."));

            _repository.Add(department);
            return Ok(ApiResponse<string>.SuccessResponse(null, "Department added successfully."));
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Department department)
        {
            if (string.IsNullOrWhiteSpace(department.DepartmentCode))
                return BadRequest(ApiResponse<string>.FailResponse("Department code is required."));

            if (string.IsNullOrWhiteSpace(department.DepartmentName))
                return BadRequest(ApiResponse<string>.FailResponse("Department name is required."));

            var rowsAffected = _repository.Update(id, department);

            if (rowsAffected == 0)
                return NotFound(ApiResponse<string>.FailResponse("Department not found."));

            return Ok(ApiResponse<string>.SuccessResponse(null, "Department updated successfully."));
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var rowsAffected = _repository.Delete(id);

            if (rowsAffected == 0)
                return NotFound(ApiResponse<string>.FailResponse("Department not found."));

            return Ok(ApiResponse<string>.SuccessResponse(null, "Department deleted successfully."));
        }
    }
}