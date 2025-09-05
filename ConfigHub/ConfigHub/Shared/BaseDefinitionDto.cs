using System;
using System.Collections.Generic;

namespace ConfigHub.Shared;

public class BaseDefinitionDto
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


//public class BaseDefinitionDto
//{
//    public long Id { get; set; }
//    public long ComponentId { get; set; }
//    public bool IsActive { get; set; }
//    public bool IsDeleted { get; set; }
//    public ControlGroupModel? CtrlGroupJson { get; set; }
//    public ControlModel? CtrlInfoJson { get; set; }
//    public ControlPropertiesModel? CtrlPropertiesJson { get; set; }
//    public ControlJsonModel? CtrlSourceJson { get; set; }
//}

//public class ControlGroupModel
//{
//    public string CtrlGroupName { get; set; }
//    public int? GroupSequence { get; set; }
//}

//public class ControlModel
//{
//    public string CtrlName { get; set; }
//    public string CtrlType { get; set; }
//    public int? DisplayName { get; set; }
//}

//public class ControlPropertiesModel
//{
//    public int? CtrlSize { get; set; }
//    public int? CtrlWidth { get; set; }
//    public int? CtrlHeight { get; set; }

////    public string ClassName { get; set; }
////    public string CssStyle { get; set; }
////    public string Tooltips { get; set; }
////    public string Placeholder { get; set; }

////    public bool? IsRequired { get; set; }
////    public string DefaultValue { get; set; }
////    public bool? IsVisible { get; set; }
////    public bool? IsDisable { get; set; }

////    public int? DecimalCount { get; set; }
////    public int? MinLength { get; set; }
////    public int? MaxLength { get; set; }
////    public string PatternType { get; set; }

////    public int? MinNumber { get; set; }
////    public int? MaxNumber { get; set; }
////    public bool? IsUnique { get; set; }
////    public bool? IsActive { get; set; }
////}

////public class ControlJsonModel
////{
////    public int? LookupId { get; set; }
////    public string LookupName { get; set; }
////    public string LookupDataSource { get; set; }
////}
