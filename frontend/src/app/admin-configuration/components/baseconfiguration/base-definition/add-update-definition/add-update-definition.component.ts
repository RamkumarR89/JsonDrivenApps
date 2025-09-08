import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { BaseDefinitionService } from '../../../../services/base-definition.service';

@Component({
  selector: 'app-add-update-definition',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-update-definition.component.html',
  styleUrls: ['./add-update-definition.component.css']
})
export class AddUpdateDefinitionComponent implements OnInit {
  showControlGroup = true;
  showControlInfo = true;
  showControlProperties = true;
  showValidation = true;
  showControlSource = true;
  public goBackToList(): void {
    this.router.navigate(['/adminconfiguration/basedefinition'], { queryParams: { compid: this.componentId } });
  }
  success: string | null = null;
  get ctrlGroupForm(): FormGroup { return this.form.get('ctrlGroupJson') as FormGroup; }
  get ctrlInfoForm(): FormGroup { return this.form.get('ctrlInfoJson') as FormGroup; }
  get ctrlPropertiesForm(): FormGroup { return this.form.get('ctrlPropertiesJson') as FormGroup; }
  get ctrlSourceForm(): FormGroup { return this.form.get('ctrlSourceJson') as FormGroup; }
  form: FormGroup;
  definitionId: number | null = null;
  componentId: number | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly baseDefinitionService: BaseDefinitionService
  ) {
    this.form = this.fb.group({
      ctrlGroupJson: this.fb.group({
        ctrlgroupname: [''],
        groupsequence: ['']
      }),
      ctrlInfoJson: this.fb.group({
        ctrlname: [''],
        ctrltype: [''],
        displayname: ['']
      }),
      ctrlPropertiesJson: this.fb.group({
        ctrlsize: [''],
        ctrlwidth: [''],
        ctrlheight: [''],
        classname: [''],
        cssstyle: [''],
        tooltips: [''],
        placeholder: [''],
        isrequired: [false],
        defaultvalue: [''],
        isvisible: [true],
        isdisable: [false],
        decimalcount: [''],
        minlength: [''],
        maxlength: [''],
        patterntype: [''],
        minnumber: [''],
        maxnumber: [''],
        isunique: [false],
        isactive: [true]
      }),
      ctrlSourceJson: this.fb.group({
        lookupid: [''],
        lookupname: [''],
        lookupdatasource: ['']
      })
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.definitionId = params['id'] ? +params['id'] : null;
    });
    this.route.queryParams.subscribe(params => {
      this.componentId = params['compid'] ? +params['compid'] : null;
    });
    if (this.definitionId) {
      this.loadDefinition(this.definitionId);
    }
  }

  loadDefinition(id: number): void {
    this.loading = true;
    this.baseDefinitionService.getDefinitionById(id).subscribe({
      next: (definition) => {
        // Parse JSON fields if they exist
        const parsedDefinition = { ...definition };
        
        if (definition.ctrlGroupJson && typeof definition.ctrlGroupJson === 'string') {
          try {
            parsedDefinition.ctrlGroupJson = JSON.parse(definition.ctrlGroupJson);
          } catch (e) {
            console.warn('Failed to parse ctrlGroupJson:', e);
            parsedDefinition.ctrlGroupJson = {};
          }
        }
        
        if (definition.ctrlInfoJson && typeof definition.ctrlInfoJson === 'string') {
          try {
            parsedDefinition.ctrlInfoJson = JSON.parse(definition.ctrlInfoJson);
          } catch (e) {
            console.warn('Failed to parse ctrlInfoJson:', e);
            parsedDefinition.ctrlInfoJson = {};
          }
        }
        
        if (definition.ctrlPropertiesJson && typeof definition.ctrlPropertiesJson === 'string') {
          try {
            parsedDefinition.ctrlPropertiesJson = JSON.parse(definition.ctrlPropertiesJson);
          } catch (e) {
            console.warn('Failed to parse ctrlPropertiesJson:', e);
            parsedDefinition.ctrlPropertiesJson = {};
          }
        }
        
        if (definition.ctrlSourceJson && typeof definition.ctrlSourceJson === 'string') {
          try {
            parsedDefinition.ctrlSourceJson = JSON.parse(definition.ctrlSourceJson);
          } catch (e) {
            console.warn('Failed to parse ctrlSourceJson:', e);
            parsedDefinition.ctrlSourceJson = {};
          }
        }
        
        this.form.patchValue(parsedDefinition);
        // Set componentId from loaded definition if not present in query params
        if (definition && definition.componentId) {
          this.componentId = definition.componentId;
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load definition.';
        this.loading = false;
      }
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.success = null;
    this.error = null;
    const formValue = this.form.value;
    const payload = {
      id: this.definitionId ?? 0,
      componentId: this.componentId ?? 0,
      isActive: true,
      isDeleted: false,
      ctrlGroupJson: JSON.stringify(formValue.ctrlGroupJson),
      ctrlInfoJson: JSON.stringify(formValue.ctrlInfoJson),
      ctrlPropertiesJson: JSON.stringify(formValue.ctrlPropertiesJson),
      ctrlSourceJson: JSON.stringify(formValue.ctrlSourceJson)
    };
    const afterSave = () => {
      this.loading = false;
      this.success = 'Definition saved successfully!';
      setTimeout(() => {
        // Always use payload.componentId for navigation
        if (payload.componentId) {
          this.router.navigate(['/adminconfiguration/basedefinition'], { queryParams: { compid: payload.componentId } });
        } else {
          this.router.navigate(['/adminconfiguration/basedefinition']);
        }
      }, 800);
    };
    if (this.definitionId) {
  this.baseDefinitionService.updateBaseDefinition(payload).subscribe({
        next: afterSave,
        error: () => {
          this.error = 'Failed to update definition.';
          this.loading = false;
        }
      });
    } else {
  this.baseDefinitionService.createBaseDefinition(payload).subscribe({
        next: afterSave,
        error: () => {
          this.error = 'Failed to create definition.';
          this.loading = false;
        }
      });
    }
  }
}
