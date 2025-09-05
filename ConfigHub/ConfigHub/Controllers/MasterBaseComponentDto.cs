using ConfigHub.Business;
using ConfigHub.Shared;
using EFCore.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ConfigHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MasterBaseComponentController : ControllerBase
    {
        private readonly IMastercomponentService _service;

        public MasterBaseComponentController(IMastercomponentService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MasterBaseDto>>> GetAll()
        {
            var components = await _service.GetAllAsync();
            return Ok(components);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MasterBaseDto>> GetById(long id)
        {
            var component = await _service.GetByIdAsync(id);
            if (component == null)
            {
                return NotFound();
            }
            return Ok(component);
        }

        [HttpPost]
        public async Task<ActionResult<MasterBaseDto>> Create(MasterBaseDto masterBaseComponentDto)
        {
            var createdComponent = await _service.CreateAsync(masterBaseComponentDto);
            return CreatedAtAction(nameof(GetById), new { id = createdComponent.Id }, createdComponent);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(long id, MasterBaseDto masterBaseComponentDto)
        {
            if (id != masterBaseComponentDto.Id)
            {
                return BadRequest();
            }
            var updatedComponent = await _service.UpdateAsync(masterBaseComponentDto);

            if (updatedComponent == null || updatedComponent.Id == 0)
            {
                return NotFound(); // Or return BadRequest with an appropriate message
            }

            return Ok(updatedComponent);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}
