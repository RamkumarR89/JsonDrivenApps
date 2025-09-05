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
    public class BaseDataController : ControllerBase
    {
        private readonly IBaseDatumService _service;

        public BaseDataController(IBaseDatumService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BaseDataDto>>> GetAll()
        {
            var baseData = await _service.GetAllAsync();
            return Ok(baseData);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<BaseDataDto>> GetById(long id)
        {
            var baseDatum = await _service.GetByIdAsync(id);
            if (baseDatum == null)
            {
                return NotFound();
            }
            return Ok(baseDatum);
        }

        [HttpGet("BaseData/{compid}")]
        public async Task<ActionResult<BaseDataDto>> GetBaseDataByComponentId(long compid)
        {
            var baseDefinition = await _service.GetBaseDataByComponentIdAsync(compid);
            //if (baseDefinition.Count <= 0)
            //{
            //    return NotFound();
            //}
            return Ok(baseDefinition);
        }

        [HttpGet("BaseData/{compid}/{id}")]
        public async Task<ActionResult<BaseDataDto>> GetBaseDataByCompIdById(long compid, long id)
        {
            var baseDefinition = await _service.GetBaseDataByCompIdByIdAsync(compid,id);
            //if (baseDefinition.Count <= 0)
            //{
            //    return NotFound();
            //}
            return Ok(baseDefinition);
        }


        [HttpPost]
        public async Task<ActionResult<BaseDataDto>> Create(BaseDataDto baseDatumDto)
        {
            try
            {
                Console.WriteLine($"[POST] /api/BaseData Payload: {System.Text.Json.JsonSerializer.Serialize(baseDatumDto)}");
                var createdBaseDatum = await _service.CreateAsync(baseDatumDto);
                Console.WriteLine($"[POST] /api/BaseData Created: {System.Text.Json.JsonSerializer.Serialize(createdBaseDatum)}");
                return CreatedAtAction(nameof(GetById), new { id = createdBaseDatum.Id }, createdBaseDatum);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[POST] /api/BaseData Error: {ex.Message}\n{ex.StackTrace}");
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        //[HttpPut("BaseData/{id}")]
        public async Task<IActionResult> Update(long id, BaseDataDto baseDatumDto)
        {
            try
            {
                Console.WriteLine($"[PUT] /api/BaseData/{id} Payload: {System.Text.Json.JsonSerializer.Serialize(baseDatumDto)}");
                if (id != baseDatumDto.Id)
                {
                    Console.WriteLine($"[PUT] /api/BaseData/{id} BadRequest: id mismatch");
                    return BadRequest();
                }
                await _service.UpdateAsync(baseDatumDto);
                Console.WriteLine($"[PUT] /api/BaseData/{id} Updated");
                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[PUT] /api/BaseData/{id} Error: {ex.Message}\n{ex.StackTrace}");
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        //[HttpPut("{id}")]
        //public async Task<IActionResult> Update(long id, BaseDataDto baseDatumDto)
        //{
        //    if (id != baseDatumDto.ComponentId)
        //    {
        //        return BadRequest();
        //    }
        //    await _service.UpdateAsync(baseDatumDto);
        //    return NoContent();
        //}

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}
