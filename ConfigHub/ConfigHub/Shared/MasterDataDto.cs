using System;

namespace ConfigHub.Shared
{
    public class MasterDataDto
    {
        public long Id { get; set; }

        public long ComponentId { get; set; } // Foreign Key to MasterBase

        public string? DataJson { get; set; } // JSON data storage

        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
    }
}
