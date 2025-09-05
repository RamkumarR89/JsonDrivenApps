import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Define FormControlType locally since import is causing issues
enum FormControlType {
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

@Component({
  selector: 'app-dynamic-json',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dynamic-json.component.html',
  styleUrls: ['./dynamic-json.component.css']
})
export class DynamicJsonComponent {
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;

  formFields: any[] = [];
  FormControlType = FormControlType;

  private getDialogWidth(): string {
    if (this.screenWidth < 600) return '90vw';
    if (this.screenWidth < 1024) return '70vw';
    return '100vw';
  }

  dialogWidth = this.getDialogWidth();
  dialogMaxHeight = this.screenHeight < 600 ? '80vh' : '90vh';
  navbar = document.querySelector('.navbar') as HTMLElement;

  generateUniqueId(): string {
    return `field-${Date.now()}`;
  }

  openSettings(field: any) {
    if (this.navbar) this.navbar.style.display = 'flex';
    console.log('Opening settings for field:', field);
  }

  addField(fieldType: any) {
    const newField = {
      id: this.generateUniqueId(),
      label: fieldType.label,
      type: fieldType.type,
      options: fieldType.type === FormControlType.Select || fieldType.type === FormControlType.Radio ? ['Option 1', 'Option 2'] : null
    };
    this.formFields.push(newField);
  }

  removeField(index: number) {
    this.formFields.splice(index, 1);
  }
}
