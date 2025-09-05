using System;
using System.Collections.Generic;

namespace EFCore.Models;

public partial class BaseDefinition
{
    public long Id { get; set; }

    public long? ComponentId { get; set; }

    public string? CtrlGroupJson { get; set; }

    public string? CtrlInfoJson { get; set; }

    public string? CtrlPropertiesJson { get; set; }

    public string? CtrlSourceJson { get; set; }

    public bool IsActive { get; set; }

    public bool IsDeleted { get; set; }
}
