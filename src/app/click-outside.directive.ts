import { Directive, ElementRef, HostListener, EventEmitter, Output,  } from '@angular/core';

@Directive({
  selector: '[clickOutside]'
})
export class ClickOutsideDirective {

  constructor(private _elementRef: ElementRef) { }

  @Output()
  public clickOutside = new EventEmitter();

  @HostListener('window:click', ['$event.target'])
  public onClick(target: HTMLElement) {
    const clickedInside = this._elementRef.nativeElement.contains(target);
        if (!clickedInside) {
            this.clickOutside.emit(null);
        }
  }
}
