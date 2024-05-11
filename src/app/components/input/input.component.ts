import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent {
  @Input()
  type: string = 'text';
  @Input()
  placeholder: string = '';
  @Input()
  value: string = '';
  @Output()
  valueChange: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  ngModelChange: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}

  inputChanged(event: any): void {
    const newValue = event.target.value;
    this.value = newValue;
    this.valueChange.emit(newValue);
    this.ngModelChange.emit(newValue);
  }
}
