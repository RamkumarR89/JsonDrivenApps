using System;
using System.Collections.Generic;

namespace ConfigHub.Shared;

public class BaseDataDto
{
    public long Id { get; set; }

    public long? ComponentId { get; set; }

    public string? BaseData { get; set; }

    public bool IsActive { get; set; }

    public bool IsDeleted { get; set; }
}
