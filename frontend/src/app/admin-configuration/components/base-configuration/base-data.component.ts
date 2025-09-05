import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BaseDefinitionService } from '../../services/base-definition.service';
import { BaseDataapiService } from '../../services/base-dataapi.service';
import { forkJoin, Subject, takeUntil, debounceTime } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-base-data',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `

    <div class="page-container p-3">
      <div class="page-header mb-3">
        <h2 class="mb-0">Base Data</h2>
      </div>
      <div *ngIf="!componentId" class="alert alert-warning themed-empty-state mb-3">No component selected.</div>
      <form *ngIf="componentId && grouped.length > 0" [formGroup]="formGroup" (ngSubmit)="onSubmit()">
        <div class="content-card mb-3" *ngFor="let group of grouped">
          <div class="card-header-themed">
            <span>{{ group.name }}</span>
          </div>
          <div class="card-body-themed">
            <div class="form-grid">
              <ng-container *ngFor="let def of group.items">
                <div class="form-group">
                  <!-- Input Field with Floating Label -->
                  <div *ngIf="def.ctrlInfoJson?.ctrltype !== 'select' && def.ctrlInfoJson?.ctrltype !== 'checkbox' && def.ctrlInfoJson?.ctrltype !== 'radio' && def.ctrlInfoJson?.ctrltype !== 'textarea'" class="form-floating">
                    <input 
                      class="form-control" 
                      [attr.type]="def.ctrlInfoJson?.ctrltype || 'text'" 
                      [formControlName]="def.ctrlInfoJson?.ctrlname" 
                      [id]="def.ctrlInfoJson?.ctrlname" 
                      [placeholder]="' '"
                      [attr.disabled]="def.ctrlPropertiesJson?.isdisable ? true : null"
                      [ngClass]="{'is-invalid': isFieldInvalid(def.ctrlInfoJson?.ctrlname)}"
                    />
                    <label [for]="def.ctrlInfoJson?.ctrlname" class="form-label">
                      {{ def.ctrlInfoJson?.displayname || def.ctrlInfoJson?.ctrlname }}
                      <span *ngIf="def.ctrlPropertiesJson?.isrequired" class="text-danger">*</span>
                    </label>
                  </div>
                  <!-- Select Field with Floating Label -->
                  <div *ngIf="def.ctrlInfoJson?.ctrltype === 'select'" class="form-floating">
                    <select 
                      class="form-select" 
                      [id]="def.ctrlInfoJson?.ctrlname" 
                      [formControlName]="def.ctrlInfoJson?.ctrlname"
                      [attr.disabled]="def.ctrlPropertiesJson?.isdisable ? true : null"
                      [ngClass]="{'is-invalid': isFieldInvalid(def.ctrlInfoJson?.ctrlname)}"
                    >
                      <option value=""></option>
                      <option *ngFor="let opt of getLookup(def)" [value]="opt[def.ctrlSourceJson?.lookupid || 'id']">
                        {{ opt[def.ctrlSourceJson?.lookupname || 'name'] }}
                      </option>
                    </select>
                    <label [for]="def.ctrlInfoJson?.ctrlname" class="form-label">
                      {{ def.ctrlInfoJson?.displayname || def.ctrlInfoJson?.ctrlname }}
                      <span *ngIf="def.ctrlPropertiesJson?.isrequired" class="text-danger">*</span>
                    </label>
                  </div>
                  <!-- Textarea Field with Floating Label -->
                  <div *ngIf="def.ctrlInfoJson?.ctrltype === 'textarea'" class="form-floating">
                    <textarea 
                      class="form-control" 
                      [id]="def.ctrlInfoJson?.ctrlname" 
                      [formControlName]="def.ctrlInfoJson?.ctrlname"
                      [placeholder]="def.ctrlPropertiesJson?.placeholder || ''"
                      [attr.disabled]="def.ctrlPropertiesJson?.isdisable ? true : null"
                      [ngClass]="{'is-invalid': isFieldInvalid(def.ctrlInfoJson?.ctrlname)}"
                      rows="3"
                      style="height: 100px;"
                    ></textarea>
                    <label [for]="def.ctrlInfoJson?.ctrlname" class="form-label">
                      {{ def.ctrlInfoJson?.displayname || def.ctrlInfoJson?.ctrlname }}
                      <span *ngIf="def.ctrlPropertiesJson?.isrequired" class="text-danger">*</span>
                    </label>
                  </div>
                  <!-- Checkbox Field -->
                  <div *ngIf="def.ctrlInfoJson?.ctrltype === 'checkbox'" class="form-check">
                    <input 
                      type="checkbox" 
                      class="form-check-input" 
                      [id]="def.ctrlInfoJson?.ctrlname" 
                      [formControlName]="def.ctrlInfoJson?.ctrlname"
                      [attr.disabled]="def.ctrlPropertiesJson?.isdisable ? true : null"
                      [ngClass]="{'is-invalid': isFieldInvalid(def.ctrlInfoJson?.ctrlname)}"
                    />
                    <label class="form-check-label" [for]="def.ctrlInfoJson?.ctrlname">
                      {{ def.ctrlInfoJson?.displayname || def.ctrlInfoJson?.ctrlname }}
                      <span *ngIf="def.ctrlPropertiesJson?.isrequired" class="text-danger">*</span>
                    </label>
                  </div>
                  <!-- Radio Field -->
                  <div *ngIf="def.ctrlInfoJson?.ctrltype === 'radio'" class="form-check">
                    <input 
                      type="radio" 
                      class="form-check-input" 
                      [id]="def.ctrlInfoJson?.ctrlname" 
                      [formControlName]="def.ctrlInfoJson?.ctrlname"
                      [value]="def.ctrlInfoJson?.displayname"
                      [attr.disabled]="def.ctrlPropertiesJson?.isdisable ? true : null"
                      [ngClass]="{'is-invalid': isFieldInvalid(def.ctrlInfoJson?.ctrlname)}"
                    />
                    <label class="form-check-label" [for]="def.ctrlInfoJson?.ctrlname">
                      {{ def.ctrlInfoJson?.displayname || def.ctrlInfoJson?.ctrlname }}
                      <span *ngIf="def.ctrlPropertiesJson?.isrequired" class="text-danger">*</span>
                    </label>
                  </div>
                  <!-- Validation Error -->
                  <div *ngIf="isFieldInvalid(def.ctrlInfoJson?.ctrlname)" class="invalid-feedback d-block">
                    <span *ngIf="formGroup.get(def.ctrlInfoJson?.ctrlname)?.errors?.['required']">
                      {{ def.ctrlInfoJson?.displayname || def.ctrlInfoJson?.ctrlname }} is required.
                    </span>
                    <span *ngIf="formGroup.get(def.ctrlInfoJson?.ctrlname)?.errors?.['minlength']">
                      Minimum length is {{ def.ctrlPropertiesJson?.minlength }} characters.
                    </span>
                    <span *ngIf="formGroup.get(def.ctrlInfoJson?.ctrlname)?.errors?.['maxlength']">
                      Maximum length is {{ def.ctrlPropertiesJson?.maxlength }} characters.
                    </span>
                  </div>
                </div>
              </ng-container>
            </div>
          </div>
        </div>
        <div class="form-actions">
          <button class="btn btn-secondary themed-btn themed-btn-secondary me-2" type="button" (click)="onCancel()">Cancel</button>
          <button class="btn btn-primary themed-btn themed-btn-primary" type="submit" [disabled]="formGroup.invalid">
            <i class="fas fa-save me-1"></i>Save
          </button>
        </div>
      </form>
      <div *ngIf="componentId && grouped.length === 0" class="alert alert-info themed-empty-state">
        <i class="fas fa-info-circle me-2"></i>
        No form definitions found for this component. Please create base definitions first.
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      width: 100%;
      max-width: 1400px;
      margin: 0 auto;
      padding-bottom: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      min-height: 0;
      position: relative;
    }
    .page-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1.2rem;
      border-radius: 12px;
      margin: 0;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      width: 100%;
    }
    .page-header h2 {
      margin: 0;
      font-weight: 600;
      text-shadow: 0 1px 2px rgba(0,0,0,0.1);
      font-size: 1.6rem;
    }
    .content-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      overflow: hidden;
      transition: all 0.3s ease;
      margin: 0;
      width: 100%;
    }
    .content-card:hover {
      box-shadow: 0 8px 15px rgba(0,0,0,0.15);
      transform: translateY(-1px);
    }
    .card-header-themed {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 0.8rem 1.2rem;
      border: none;
      font-weight: 600;
      display: flex;
      align-items: center;
      font-size: 1rem;
    }
    .card-body-themed {
      padding: 1.2rem;
      background: white;
    }
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
    }
    .form-label {
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #374151;
      font-size: 0.875rem;
    }
    /* Floating label fix */
    .form-floating {
      position: relative;
    }
    .form-floating > .form-control,
    .form-floating > .form-select,
    .form-floating > textarea {
      height: auto;
      padding: 1.25rem 0.75rem 0.25rem 0.75rem;
      background: #fff;
    }
    .form-floating > label {
      position: absolute;
      top: 50%;
      left: 0.75rem;
      transform: translateY(-50%);
      z-index: 2;
      pointer-events: none;
      transition: all 0.2s;
      opacity: 0.7;
      background: transparent;
      font-size: 1em;
      color: #374151;
      padding: 0 0.25rem;
    }
    .form-floating > .form-control:focus ~ label,
    .form-floating > .form-control:not(:placeholder-shown) ~ label,
    .form-floating > .form-select:focus ~ label,
    .form-floating > .form-select:valid ~ label,
    .form-floating > textarea:focus ~ label,
    .form-floating > textarea:not(:placeholder-shown) ~ label {
      top: -0.6rem;
      left: 0.5rem;
      font-size: 0.85em;
      opacity: 0.85;
      color: #667eea;
      background: #fff;
      transform: none;
      padding: 0 0.25rem;
    }
    .form-control {
      padding: 0.75rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 0.875rem;
      transition: all 0.2s;
      background-color: #fff;
    }
    .form-control:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
    }
    .form-check {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .form-check-input {
      width: 3rem;
      height: 1.5rem;
    }
    .form-check-label {
      font-weight: 500;
      color: #374151;
      font-size: 0.875rem;
    }
    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
    }
    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
    .btn-primary, .themed-btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .btn-primary:hover:not(:disabled), .themed-btn-primary:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102,126,234,0.3);
    }
    .btn-secondary, .themed-btn-secondary {
      background: #6b7280;
      color: white;
    }
    .btn-secondary:hover:not(:disabled), .themed-btn-secondary:hover:not(:disabled) {
      background: #4b5563;
      transform: translateY(-1px);
    }
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .text-danger {
      color: #dc2626 !important;
    }
    .themed-empty-state {
      color: #718096;
      text-align: center;
      padding: 3rem;
    }
    .themed-empty-state i {
      color: #e2e8f0;
      margin-bottom: 1.5rem;
      font-size: 2rem;
      opacity: 0.5;
    }
    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      .form-actions {
        flex-direction: column;
        gap: 0.5rem;
        align-items: stretch;
      }
      .btn {
        width: 100%;
      }
    }
  `]
})
export class BaseDataComponent implements OnInit, OnDestroy {
  componentId: string | null = null;
  formGroup!: FormGroup;
  grouped: any[] = [];
  
  private destroy$ = new Subject<void>();
  private dataLoaded = false;
  private isLoading = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly baseDefinitionService: BaseDefinitionService,
    private readonly baseDataService: BaseDataapiService,
    private readonly fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    console.log('BaseDataComponent constructor called');
  }

  ngOnInit(): void {
    console.log('BaseDataComponent ngOnInit called');
    this.formGroup = this.fb.group({});
    
    // Add delay to prevent immediate execution
    setTimeout(() => {
      this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
        const newComponentId = params['id'] ?? params['componentId'] ?? null;
        console.log('Route params changed, componentId:', newComponentId);
        if (newComponentId && newComponentId !== this.componentId) {
          this.componentId = newComponentId;
          this.dataLoaded = false;
          this.isLoading = false;
          // Add small delay to prevent rapid successive calls
          setTimeout(() => {
            this.loadDataAndDefinitions(this.componentId!);
          }, 10);
        }
      });
    }, 0);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDataAndDefinitions(componentId: string) {
    if (this.dataLoaded || this.isLoading) {
      console.log('Data already loaded or loading, skipping...');
      return; // Prevent loading the same data multiple times
    }

    console.log('Loading data for component:', componentId);
    this.isLoading = true;

    forkJoin({
      definitions: this.baseDefinitionService.getDefinitionsByComponentId(+componentId),
      existingData: this.baseDataService.getData(componentId)
    }).pipe(
      takeUntil(this.destroy$),
      debounceTime(50) // Add debounce to prevent rapid successive calls
    ).subscribe({
      next: ({ definitions, existingData }) => {
        console.log('Data loaded successfully');
        const groupedMap: { [key: string]: any[] } = {};
        const controls: { [key: string]: FormControl } = {};

        definitions.forEach(d => {
          const group = d.ctrlGroupJson?.ctrlgroupname || 'General';
          groupedMap[group] = groupedMap[group] || [];
          groupedMap[group].push(d);
          const name = d.ctrlInfoJson?.ctrlname || '';
          if (name) {
            const defaultVal = d.ctrlPropertiesJson?.defaultvalue ?? '';
            controls[name] = new FormControl(defaultVal, this.validatorsFromDef(d));
          }
        });

        this.formGroup = new FormGroup(controls);
        this.grouped = Object.keys(groupedMap).map(k => ({ name: k, items: groupedMap[k] }));

        // Patch existing data if available
        const json = existingData && typeof existingData === 'object' ? this.safeParse(existingData) : null;
        if (json && Array.isArray(json) && json.length > 0) {
          const baseData = JSON.parse(json[0].baseData || '{}');
          this.formGroup.patchValue(baseData);
        }

        this.dataLoaded = true;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.isLoading = false;
      }
    });
  }  private validatorsFromDef(d: any) {
    const v = [] as any[];
    if (d.ctrlPropertiesJson?.isrequired) v.push(Validators.required);
    if (d.ctrlPropertiesJson?.minlength) v.push(Validators.minLength(d.ctrlPropertiesJson.minlength));
    if (d.ctrlPropertiesJson?.maxlength) v.push(Validators.maxLength(d.ctrlPropertiesJson.maxlength));
    if (d.ctrlPropertiesJson?.patterntype) v.push(Validators.pattern(d.ctrlPropertiesJson.patterntype));
    return v;
  }

  getLookup(d: any) {
    try {
      const raw = d.ctrlSourceJson?.lookupdatasource;
      if (!raw) return [];
      return typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch {
      return [];
    }
  }

  private safeParse(text: any) {
    try { return typeof text === 'string' ? JSON.parse(text) : text; } catch { return null; }
  }

  private setFormValues(): void {
    try {
      const baseData = this.formGroup.value || {};

      this.grouped.forEach(group => {
        group.items.forEach((item: any) => {
          const controlName = item.ctrlInfoJson?.ctrlname;
          const defaultValue = item.ctrlPropertiesJson?.defaultvalue || '';

          const control = this.formGroup.get(controlName);

          if (control) {
            const controlValue = baseData[controlName] !== undefined ? baseData[controlName] : defaultValue;
            control.setValue(controlValue, { emitEvent: false });
          } else {
            console.warn(`No control found for key: ${controlName}`);
          }
        });
      });
      // Removed cdr.detectChanges() to prevent infinite loop
    } catch (error) {
      console.error('Error setting form values:', error);
    }
  }

  onSubmit() {
    if (!this.componentId || this.formGroup.invalid) return;
    const payload = {
      componentId: this.componentId,
      baseData: JSON.stringify(this.formGroup.value),
      isActive: true,
      isDeleted: false
    };
    this.baseDataService.postData(payload).subscribe(() => {
      this.router.navigate(['/adminconfiguration/basedata', this.componentId]);
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.formGroup.get(fieldName);
    return control ? (control.invalid && (control.dirty || control.touched)) : false;
  }

  onCancel(): void {
    this.router.navigate(['/adminconfiguration/baseconfiguration']);
  }
}


