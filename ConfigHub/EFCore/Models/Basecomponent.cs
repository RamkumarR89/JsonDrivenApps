using System;
using System.Collections.Generic;

namespace EFCore.Models;

public partial class Basecomponent
{
    public long Id { get; set; }

    public string ComponentName { get; set; } = null!;

    public string ParentComponent { get; set; } = null!;

    public string DisplayName { get; set; } = null!;

    public bool IsActive { get; set; }

    public bool IsDeleted { get; set; }

    public string? ComponentJson { get; set; }

    public string? CustomAttributeJson { get; set; }

    public bool IsMaster { get; set; }
}
