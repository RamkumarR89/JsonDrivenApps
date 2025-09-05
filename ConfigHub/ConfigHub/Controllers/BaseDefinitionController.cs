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
    public class BaseDefinitionController : ControllerBase
    {
        private readonly IBaseDefinitionService _service;

        public BaseDefinitionController(IBaseDefinitionService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BaseDefinitionDto>>> GetAll()
        {
            var baseDefinitions = await _service.GetAllAsync();
            return Ok(baseDefinitions);
        }

        [HttpGet("componentList/{compId}")]
        public async Task<ActionResult<IEnumerable<BaseDefinitionDto>>> GetAllByCompoentId(long compId)
        {
            var baseDefinitions = await _service.GetAllBycompIdAsync(compId);
            return Ok(baseDefinitions);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BaseDefinitionDto>> GetById(long id)
        {
            var baseDefinition = await _service.GetByIdAsync(id);
            if (baseDefinition == null)
            {
                return NotFound();
            }
            return Ok(baseDefinition);
        }

        [HttpGet("component/{id}")]
        public async Task<ActionResult<BaseDefinitionDto>> GetpComponentById(long id)
        {
            var baseDefinition = await _service.GetByComponentIdAsync(id);
            if (baseDefinition == null)
            {
                return NotFound();
            }
            return Ok(baseDefinition);
        }

        [HttpPost]
        public async Task<ActionResult<BaseDefinitionDto>> Create(BaseDefinitionDto baseDefinitionDto)
        {
            var createdBaseDefinition = await _service.CreateAsync(baseDefinitionDto);
            return CreatedAtAction(nameof(GetById), new { id = createdBaseDefinition.Id }, createdBaseDefinition);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(long id, BaseDefinitionDto baseDefinitionDto)
        {
            if (id != baseDefinitionDto.Id)
            {
                return BadRequest();
            }
            
            var updatedbaseDefinition = await _service.UpdateAsync(baseDefinitionDto);

            if (updatedbaseDefinition == null || updatedbaseDefinition.Id == null)
            {
                return NotFound(); // Or return BadRequest with an appropriate message
            }

            return Ok(updatedbaseDefinition);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}
