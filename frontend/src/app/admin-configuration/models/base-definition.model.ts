export interface BaseDefinition {
  id?: number;
  componentId: number;
  isActive: boolean;
  isDeleted?: boolean;
  ctrlGroupJson: ControlGroup;
  ctrlInfoJson: ControlInfo;
  ctrlPropertiesJson: ControlProperties;
  ctrlSourceJson: ControlSource;
}

export class BaseDefinitionDto {
  id: number = 0;
  componentId: number = 0;
  isActive: boolean = true;
  isDeleted: boolean = false;
  ctrlGroupJson: string = '';
  ctrlInfoJson: string = '';
  ctrlPropertiesJson: string = '';
  ctrlSourceJson: string = '';
}

export interface ControlGroup {
  ctrlgroupname?: string;
  groupsequence?: number;
}

export interface ControlInfo {
  ctrlname?: string;
  ctrltype?: string;
  displayname?: number;
}

export interface ControlProperties {
  ctrlsize?: number;
  ctrlwidth?: number;
  ctrlheight?: number;

  classname?: string;
  cssstyle?: string;
  tooltips?: string;
  placeholder?: string;

  isrequired?: boolean;
  defaultvalue?: string;
  isvisible?: boolean;
  isdisable?: boolean;

  decimalcount?: number;
  minlength?: number;
  maxlength?: number;
  patterntype?: string;

  minnumber?: number;
  maxnumber?: number;
  isunique?: boolean;
  isactive?: boolean;
}

export interface ControlSource {
  lookupid?: string;
  lookupname?: string;
  lookupdatasource?: string;
}
