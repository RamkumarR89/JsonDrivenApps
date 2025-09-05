export enum FormControlType {
  Text = 'text',
  Number = 'number',
  Email = 'email',
  Password = 'password',
  Select = 'select',
  Radio = 'radio',
  Checkbox = 'checkbox',
  Textarea = 'textarea',
  Date = 'date',
  DateTime = 'datetime-local',
  File = 'file'
}

export interface IdNameModel {
  id: number | string;
  name: string;
}
