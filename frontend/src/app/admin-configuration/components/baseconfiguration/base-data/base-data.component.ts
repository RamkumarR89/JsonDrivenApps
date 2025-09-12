import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonAgGridComponent } from '../../common-ag-grid/common-ag-grid.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BaseDefinitionService } from '../../../services/base-definition.service';
import { BaseDataapiService } from '../../../services/base-dataapi.service';
import { forkJoin, Subject, takeUntil, debounceTime } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-base-data',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CommonAgGridComponent],
  template: `

    <div class="page-container p-3" style="display: flex; flex-direction: column; height: 100vh; width: 100vw;">
  <div class="content-card slide-in-up ag-card-flex" style="display: flex; flex-direction: column; width: 100%; max-width: 100vw; height: 100%; min-height: 0; margin: 0; padding: 0; box-sizing: border-box; overflow: auto;">
        <div class="card-header-themed" style="width: 100%; box-sizing: border-box;">
          <h5 class="mb-0"><i class="fas fa-list me-2"></i>Data List - AG Grid</h5>
          <span class="badge bg-light text-dark">{{ grouped.length }} Total</span>
        </div>
  <div class="card-body-themed ag-body-flex" style="display: flex; flex-direction: column; flex: 1 1 auto; width: 100%; height: 100%; min-height: 0; margin: 0; padding: 0; box-sizing: border-box; overflow: auto;">
          <div *ngIf="componentId && grouped.length > 0" class="ag-form-flex" style="display: flex; flex-direction: column; flex: 1 1 auto; width: 100%; height: 100%; min-height: 0; margin: 0; padding: 0; box-sizing: border-box;">
            <form [formGroup]="formGroup" (ngSubmit)="onSubmit()" class="ag-form-full" style="display: flex; flex-direction: column; flex: 1 1 auto; width: 100%; height: 100%; min-height: 0; margin: 0; padding: 0; box-sizing: border-box;">
              <div class="form-grid ag-form-grid-full" style="display: flex; flex-direction: column; flex: 1 1 auto; width: 100%; height: 100%; min-height: 0; margin: 0; padding: 0; box-sizing: border-box;">
                <ng-container *ngFor="let group of grouped">
                  <ng-container *ngFor="let def of group.items">
                    <div class="form-group ag-form-group-full" style="display: flex; flex-direction: column; flex: 1 1 auto; width: 100%; height: 100%; min-height: 0; margin: 0; padding: 0; box-sizing: border-box;">
                      <!-- Input, Select, Textarea, Checkbox, Radio fields unchanged -->
                      <!-- ...existing code... -->
                      <!-- Grid Field -->
                      <div *ngIf="def.ctrlInfoJson?.ctrltype === 'grid'" class="ag-grid-container ag-grid-flex" style="display: flex; flex: 1 1 auto; width: 100%; max-width: 100%; height: 100%; min-width: 0; min-height: 0; margin: 0; padding: 0; box-sizing: border-box; overflow: auto;">
                        <app-common-ag-grid
                          [gridDefinitions]="def.gridDefinitions"
                          [rowData]="def.gridData"
                          (gridReady)="onGridReady($event)"
                          (cellClicked)="onCellClicked($event)"
                          style="display: flex; flex: 1 1 auto; width: 100%; height: 100%; min-width: 0; min-height: 0; margin: 0; padding: 0; box-sizing: border-box;"
                        ></app-common-ag-grid>
                      </div>
                      <!-- ...existing code... -->
                    </div>
                  </ng-container>
                </ng-container>
              </div>
              <div class="form-actions">
                <button class="btn btn-secondary themed-btn themed-btn-secondary me-2" type="button" (click)="onCancel()">Cancel</button>
                <button class="btn btn-primary themed-btn themed-btn-primary" type="submit" [disabled]="formGroup.invalid">
                  <i class="fas fa-save me-1"></i>Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      width: 100vw;
      min-height: 100vh;
      margin: 0;
      padding: 2rem 2vw 2rem 2vw;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      box-sizing: border-box;
      position: relative;
      background: #f8fafc;
    }
    .page-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1.2rem 2vw;
      border-radius: 12px;
      margin: 0;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      width: 100%;
      box-sizing: border-box;
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
      min-height: 60vh;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: stretch;
      box-sizing: border-box;
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
      padding: 1.2rem 0.5vw;
      background: white;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: stretch;
    }
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
      width: 100%;
      box-sizing: border-box;
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
      .page-container {
        padding: 1rem 0.5vw 1rem 0.5vw;
      }
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
      .content-card {
        min-height: 40vh;
      }
    }
  `]
})
export class BaseDataComponent implements OnInit, OnDestroy {
  // Handler for gridReady event
  onGridReady(event: any): void {
    // TODO: Implement grid initialization logic if needed
    console.log('Grid ready:', event);
  }

  // Handler for cellClicked event
  onCellClicked(event: any): void {
    // TODO: Implement cell click logic if needed
    console.log('Cell clicked:', event);
  }
  componentId: string | null = null;
  formGroup!: FormGroup;
  grouped: any[] = [];
  statusMessage: string = '';
  statusType: 'success' | 'error' | '' = '';
  
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
      debounceTime(50)
    ).subscribe({
      next: ({ definitions, existingData }) => {
        debugger
        console.log('Fetched definitions:', definitions);
        debugger;
        console.log('Data loaded successfully');
        const groupedMap: { [key: string]: any[] } = {};
        const controls: { [key: string]: FormControl } = {};
        // Group grid controls by group name and merge their columns/data without duplicates
        const gridGroups: { [group: string]: { columns: any[]; data: any[]; baseDef: any } } = {};
        definitions.forEach(d => {
          const group = d.ctrlGroupJson?.ctrlgroupname || 'General';
          groupedMap[group] = groupedMap[group] || [];
            if (d.ctrlInfoJson?.ctrltype === 'grid') {
              // If ctrlGridJson is missing, create it using ctrlname as the field
              if (!d.ctrlInfoJson.ctrlGridJson) {
                const ctrlName = d.ctrlInfoJson.ctrlname || 'value';
                d.ctrlInfoJson.ctrlGridJson = {
                  columns: [
                    {
                      field: ctrlName,
                      headerName: ctrlName.charAt(0).toUpperCase() + ctrlName.slice(1),
                      sortable: true,
                      filter: true
                    }
                  ],
                  data: []
                };
              }
              const columns = d.ctrlInfoJson.ctrlGridJson.columns;
              const data = d.ctrlInfoJson.ctrlGridJson.data || [];
              // Merge grid controls under the same group, but avoid duplicate columns
              if (!gridGroups[group]) {
                gridGroups[group] = { columns: [], data: [], baseDef: d };
              }
              columns.forEach((col: any) => {
                if (!gridGroups[group].columns.some((existing: any) => existing.field === col.field)) {
                  gridGroups[group].columns.push(col);
                }
              });
              gridGroups[group].data = gridGroups[group].data.concat(data);
            } else {
              groupedMap[group].push(d);
            }
          const name = d.ctrlInfoJson?.ctrlname || '';
          if (name) {
            const defaultVal = d.ctrlPropertiesJson?.defaultvalue ?? '';
            controls[name] = new FormControl(defaultVal, this.validatorsFromDef(d));
          }
        });

        // Add merged grid controls to groupedMap (one grid per group)
        Object.keys(gridGroups).forEach(group => {
          const gridDef = gridGroups[group].baseDef;
          const defAny = gridDef as any;
          defAny.gridDefinitions = gridGroups[group].columns;
          defAny.gridData = gridGroups[group].data;
          groupedMap[group].push(gridDef);
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
    this.baseDataService.postData(payload).subscribe({
      next: (res: any) => {
        this.statusMessage = 'Base data saved successfully!';
        this.statusType = 'success';
        setTimeout(() => {
          this.statusMessage = '';
          this.statusType = '';
        }, 3000); // Hide after 3 seconds
      },
      error: (err: any) => {
        this.statusMessage = 'Failed to save base data.';
        this.statusType = 'error';
        setTimeout(() => {
          this.statusMessage = '';
          this.statusType = '';
        }, 3000); // Hide after 3 seconds
      }
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


