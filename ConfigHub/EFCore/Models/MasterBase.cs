using System;
using System.Collections.Generic;

namespace EFCore.Models;

public partial class MasterBase
{
    public long Id { get; set; }

    public string Name { get; set; } = null!;

    public string ParentComponent { get; set; } = null!;

    public string DisplayName { get; set; } = null!;

    public bool IsActive { get; set; }

    public bool IsDeleted { get; set; }

    public string? ComponentJson { get; set; }

    public string? CustomAttributeJson { get; set; }
}
