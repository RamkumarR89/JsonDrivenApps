export class BasedefinitionmodelDto {
  id: number | any = 0;
  componentId: number | any;
  isActive: boolean | any;
  isDeleted: boolean | any;
  ctrlGroupJson: string | any;
  ctrlInfoJson: string | any;
  ctrlPropertiesJson: string | any;
  ctrlSourceJson: string | any;
}

export interface IBasedefinitionmodel {
    id: number | any;
    componentId: number| any;
    isActive: boolean;
    isDeleted: boolean;
    ctrlGroupJson: Controlgroupmodel | any;
    ctrlInfoJson: Controlmodel| any;
    ctrlPropertiesJson: Controlpropertiesmodel| any;
    ctrlSourceJson: Controljsonmodel| any;
}

export class Controlgroupmodel{
  ctrlgroupname?: string| any;
  groupsequence?: number| any;

  toJson(): any {
    return {
      ctrlgroupname: this.ctrlgroupname,
      groupsequence: this.groupsequence,
    };
  }
}

export class Controlmodel {
  ctrlname?: string| any;
  ctrltype?: string| any;
  displayname?: number;

  toJson(): any {
    return {
      ctrlname: this.ctrlname,
      ctrltype: this.ctrltype,
      displayname: this.displayname,
    };
  }
}

export class Controlpropertiesmodel {
  ctrlsize?: number| any;
  ctrlwidth?: number| any;
  ctrlheight?: number| any;

  classname?: string| any;
  cssstyle?: string| any;
  tooltips?: string| any;
  placeholder?: string| any;

  isrequired?: boolean| any;
  defaultvalue?: string| any;
  isvisible?: boolean| any;
  isdisable?: boolean| any;

  decimalcount?: number| any;
  minlength?: number| any;
  maxlength?: number| any;
  patterntype?: string| any;

  minnumber?: number| any;
  maxnumber?: number| any;
  isunique?: boolean| any;
  isactive?: boolean| any;

  toJson(): any {
    return {
      ctrlsize: this.ctrlsize,
      ctrlwidth: this.ctrlwidth,
      ctrlheight: this.ctrlheight,
      classname: this.classname,
      cssstyle: this.cssstyle,
      tooltips: this.tooltips,
      placeholder: this.placeholder,
      isrequired: this.isrequired,
      defaultvalue: this.defaultvalue,
      isvisible: this.isvisible,
      isdisable: this.isdisable,
      decimalcount: this.decimalcount,
      minlength: this.minlength,
      maxlength: this.maxlength,
      patterntype: this.patterntype,
      minnumber: this.minnumber,
      maxnumber: this.maxnumber,
      isunique: this.isunique,
      isactive: this.isactive,
    };
  }
}

export class Controljsonmodel {
  lookupid?: string| any;
  lookupname?: string| any;
  lookupdatasource?: string| any;

  toJson(): any {
    return {
      lookupid: this.lookupid,
      lookupname: this.lookupname,
      lookupdatasource: this.lookupdatasource,
    };
  }
}
