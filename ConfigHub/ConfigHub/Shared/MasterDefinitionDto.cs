using System;

namespace ConfigHub.Shared
{
    public class MasterDefinitionDto
    {
        public long Id { get; set; }

        public long ComponentId { get; set; } // One-to-One with MasterBase

        public string? CtrlGroupJson { get; set; }
        public string? CtrlInfoJson { get; set; }
        public string? CtrlPropertiesJson { get; set; }
        public string? CtrlSourceJson { get; set; }

        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
    }
}
