using ConfigHub.Business;
using ConfigHub.Shared;
using EFCore.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ConfigHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BasecomponentController : ControllerBase
    {
        private readonly IBasecomponentService _service;

        public BasecomponentController(IBasecomponentService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BasecomponentDto>>> GetAll()
        {
            var components = await _service.GetAllAsync();
            return Ok(components);
        }

        // Simple test endpoint
        [HttpGet("test")]
        [ProducesResponseType(typeof(object), 200)]
        public ActionResult Test()
        {
            return Ok(new { message = "API is working!", timestamp = DateTime.Now });
        }

        // Server-side paging endpoint for AG Grid
        [HttpGet("paged")]
        public async Task<ActionResult> GetPaged([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var all = await _service.GetAllAsync();
            var total = all.Count();
            var paged = all.Skip((page - 1) * pageSize).Take(pageSize);
            return Ok(new { data = paged, total });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BasecomponentDto>> GetById(long id)
        {
            var component = await _service.GetByIdAsync(id);
            if (component == null)
            {
                return NotFound();
            }
            return Ok(component);
        }

        [HttpPost]
        public async Task<ActionResult<BasecomponentDto>> Create(BasecomponentDto basecomponentDto)
        {
            var createdComponent = await _service.CreateAsync(basecomponentDto);
            return CreatedAtAction(nameof(GetById), new { id = createdComponent.Id }, createdComponent);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(long id, BasecomponentDto basecomponentDto)
        {
            if (id != basecomponentDto.Id)
            {
                return BadRequest();
            }
            var updatedComponent = await _service.UpdateAsync(basecomponentDto);

            if (updatedComponent == null)
            {
                return NotFound(); // Or return BadRequest with an appropriate message
            }

            return Ok(updatedComponent);
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            await _service.DeleteAsync((int)id);
            return NoContent();
        }
    }

}
