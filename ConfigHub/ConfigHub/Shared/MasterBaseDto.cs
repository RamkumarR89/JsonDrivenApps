using System;
using System.ComponentModel;

namespace ConfigHub.Shared
{
    public class MasterBaseDto
    {
        public long Id { get; set; }

        public string ComponentName { get; set; } = null!;

        public string ParentComponent { get; set; } = null!;

        public string DisplayName { get; set; } = null!;

        public bool IsActive { get; set; }

        public bool IsDeleted { get; set; }

        public string? ComponentJson { get; set; }

        public string? CustomAttributeJson { get; set; }
    }
}
