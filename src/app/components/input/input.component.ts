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
  type: string;
  @Input()
  ngModelValue: string;
  @Output()
  ngModelChange: EventEmitter<string> = new EventEmitter<string>();
  @Input()
  placeholder: string;

  constructor() {}
  onInputChange(newValue: string) {
    this.ngModelValue = newValue;
    this.ngModelChange.emit(newValue);
  }
}
