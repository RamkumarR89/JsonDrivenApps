using System;
using System.Collections.Generic;

namespace EFCore.Models;

public partial class BaseDatum
{
    public long Id { get; set; }

    public long? ComponentId { get; set; }

    public string? BaseData { get; set; }

    public bool IsActive { get; set; }

    public bool IsDeleted { get; set; }
}
