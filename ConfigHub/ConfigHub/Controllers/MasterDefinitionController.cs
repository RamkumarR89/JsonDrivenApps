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
    public class MasterBaseDefinitionController : ControllerBase
    {
        private readonly IMasterDefinitionService _service;

        public MasterBaseDefinitionController(IMasterDefinitionService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MasterDefinitionDto>>> GetAll()
        {
            var masterBaseDefinitions = await _service.GetAllAsync();
            return Ok(masterBaseDefinitions);
        }

        [HttpGet("componentList/{compId}")]
        public async Task<ActionResult<IEnumerable<MasterDefinitionDto>>> GetAllByComponentId(long compId)
        {
            var masterBaseDefinitions = await _service.GetAllByCompIdAsync(compId);
            return Ok(masterBaseDefinitions);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MasterDefinitionDto>> GetById(long id)
        {
            var masterBaseDefinition = await _service.GetByIdAsync(id);
            if (masterBaseDefinition == null)
            {
                return NotFound();
            }
            return Ok(masterBaseDefinition);
        }

        [HttpGet("component/{id}")]
        public async Task<ActionResult<MasterDefinitionDto>> GetComponentById(long id)
        {
            var masterBaseDefinition = await _service.GetByComponentIdAsync(id);
            if (masterBaseDefinition == null)
            {
                return NotFound();
            }
            return Ok(masterBaseDefinition);
        }

        [HttpPost]
        public async Task<ActionResult<MasterDefinitionDto>> Create(MasterDefinitionDto masterBaseDefinitionDto)
        {
            var createdMasterBaseDefinition = await _service.CreateAsync(masterBaseDefinitionDto);
            return CreatedAtAction(nameof(GetById), new { id = createdMasterBaseDefinition.Id }, createdMasterBaseDefinition);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(long id, MasterDefinitionDto masterBaseDefinitionDto)
        {
            if (id != masterBaseDefinitionDto.Id)
            {
                return BadRequest();
            }

            var updatedMasterBaseDefinition = await _service.UpdateAsync(masterBaseDefinitionDto);

            if (updatedMasterBaseDefinition == null || updatedMasterBaseDefinition.Id == null)
            {
                return NotFound(); // Or return BadRequest with an appropriate message
            }

            return Ok(updatedMasterBaseDefinition);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}
