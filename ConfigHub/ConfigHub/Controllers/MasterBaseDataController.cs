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
    public class MasterBaseDataController : ControllerBase
    {
        private readonly IMasterDataService _service;

        public MasterBaseDataController(IMasterDataService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MasterBaseDto>>> GetAll()
        {
            var masterBaseData = await _service.GetAllAsync();
            return Ok(masterBaseData);
        }

        [HttpGet("masterBaseData/{id}")]
        public async Task<ActionResult<MasterDataDto>> GetById(long id)
        {
            var masterBaseDatum = await _service.GetByIdAsync(id);
            if (masterBaseDatum == null)
            {
                return NotFound();
            }
            return Ok(masterBaseDatum);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MasterDataDto>> GetMasterBaseDataByComponentId(long id)
        {
            var masterBaseDatum = await _service.GetByComponentIdAsync(id);
            if (masterBaseDatum == null)
            {
                return NotFound();
            }
            return Ok(masterBaseDatum);
        }

        [HttpPost]
        public async Task<ActionResult<MasterDataDto>> Create(MasterDataDto masterBaseDatumDto)
        {
            var createdMasterBaseDatum = await _service.CreateAsync(masterBaseDatumDto);
            return CreatedAtAction(nameof(GetById), new { id = createdMasterBaseDatum.Id }, createdMasterBaseDatum);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(long id, MasterDataDto masterBaseDatumDto)
        {
            if (id != masterBaseDatumDto.Id)
            {
                return BadRequest();
            }

            var updatedMasterBaseDatum = await _service.UpdateAsync(masterBaseDatumDto);

            if (updatedMasterBaseDatum == null || updatedMasterBaseDatum.Id == null)
            {
                return NotFound(); // Or return BadRequest with an appropriate message
            }

            return Ok(updatedMasterBaseDatum);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}
