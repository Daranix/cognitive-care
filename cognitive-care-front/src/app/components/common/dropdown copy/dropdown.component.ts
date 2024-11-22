import { NgClass } from '@angular/common';
import { AfterViewInit, Component, ElementRef, forwardRef, inject, Injector, input, model, OnDestroy, OnInit, Renderer2, viewChild } from '@angular/core';
import { ControlContainer, ControlValueAccessor, FormControl, FormControlDirective, FormControlName, FormGroup, NG_VALUE_ACCESSOR, NgControl, NgModel, ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [NgClass, IconComponent],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true,
    }
  ]
})
export class DropdownComponent<T> implements ControlValueAccessor, OnInit, OnDestroy, AfterViewInit {

  private readonly renderer2 = inject(Renderer2);
  readonly label = input('');
  readonly placeholder = input('');
  readonly name = input.required<string>();
  readonly disabled = model<boolean>(false);
  readonly options = input.required<T[]>();
  readonly key = input.required<keyof T>();
  readonly selectLabel = input.required<keyof T>();
  readonly value = model<unknown>();
  // ngControl = inject(NgControl, { self: true, optional: true });
  private injector = inject(Injector);
  private readonly selectRef = viewChild<ElementRef<HTMLSelectElement>>('selectorRef')

  control?: FormControl | null;
  ngControl?: NgControl;
  private subscription?: Subscription;

  private readonly errorMessages: Record<string, string> = {
    'required': 'Field is required'
  };

  constructor() {
    /*if(this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }*/
  }
  ngAfterViewInit(): void {
    const defaultValue = this.getDefaultValue()
    this.control?.setValue(defaultValue);
    this.updateValue(defaultValue);
  }

  onChange = (value: unknown) => {
    this.value.set(value)
  };

  onTouched = () => { };

  // ControlValueAccessor methods
  writeValue(value: unknown): void {
    this.value.set(value);
    this.setProperty('value', value);
  }

  registerOnChange(fn: (value: any) => any): void {
    this.onChange = (value: unknown) => {
      this.value.set(value);
      fn(value);
    };
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled)
  }
    
  onSelect(ev: Event) {
    const selectValue = ev.target as HTMLSelectElement;
    const value = selectValue.value as unknown;
    this.updateValue(value)
  }


  ngOnInit() {
    const ngControl = this.injector.get(NgControl, null, { self: true, optional: true });
    this.ngControl = ngControl!;

    if (ngControl && ngControl != null) {
      if (ngControl instanceof NgModel) {
        this.control = ngControl.control;
        this.subscription = ngControl.control.valueChanges.subscribe((value) => {
          if (ngControl.model !== value || ngControl.viewModel !== value && value !== '') {
            ngControl.viewToModelUpdate(value);
          }
        });

      } else if (ngControl instanceof FormControlDirective) {
        this.control = ngControl.control;

      } else if (ngControl instanceof FormControlName) {
        const container = this.injector.get(ControlContainer).control as FormGroup;
        this.control = container.controls[ngControl.name!] as FormControl;

      } else {
        this.control = new FormControl();
      }
    }
    
    this.updateValue(this.getDefaultValue());

  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  getErrorMessages(errors: ValidationErrors | null | undefined) {

    if (!errors) {
      return [];
    }

    const keys = Object.keys(errors);
    return keys.map((v) => this.errorMessages[v] || undefined);
  }

  private updateValue(value: unknown) {
    this.writeValue(value);
    this.value.set(value);
    this.onChange(value);
    this.onTouched();
  }

  private getDefaultValue() {
    return this.options()[0][this.key()];;
  }

  setProperty(key: string, value: any): void {
    this.renderer2.setProperty(this.selectRef()?.nativeElement, key, value);
  }

}