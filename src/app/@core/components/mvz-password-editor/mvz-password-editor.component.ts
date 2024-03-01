import { NgIf } from '@angular/common';
import { Component, Input, OnInit, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonInput, IonicModule } from '@ionic/angular';

@Component({
  selector: 'mvz-password-editor',
  templateUrl: './mvz-password-editor.component.html',
  styleUrls: ['./mvz-password-editor.component.scss'],
  standalone: true,
  imports: [IonicModule, NgIf],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MvzPasswordEditorComponent),
      multi: true,
    },
  ],
})
export class MvzPasswordEditorComponent
  implements OnInit, ControlValueAccessor
{
  @Input() label: string;
  @ViewChild('passInput', { static: false }) inputPass: IonInput;

  public showPass: boolean;
  public inputType: string;
  public value: string;
  public isDisabled: boolean;
  onChange = (_: any) => {};
  onTouch = () => {};
  focus = () => {
    this.inputPass.setFocus();
  };
  constructor() {}

  ngOnInit() {
    this.inputType = 'password';
  }

  onInput(value: string) {
    this.value = value;
    this.onTouch();
    this.onChange(this.value);
  }
  writeValue(value: any): void {
    if (value) {
      this.value = value || '';
    } else {
      this.value = '';
    }
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
