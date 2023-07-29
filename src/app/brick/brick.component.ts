import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-brick',
  template: '<div></div>',
  styleUrls: ['./brick.component.scss']
})
export class BrickComponent implements OnInit {
  @Input() x = 0; // x-coordinate of the brick
  @Input() y = 0; // y-coordinate of the brick
  @Input() width = 75; // width of the brick
  @Input() height = 20; // height of the brick

  ngOnInit(): void {
    // Set the style for the brick element (position and size)
    const brickElement = this.getBrickElement();
    brickElement.style.left = this.x + 'px';
    brickElement.style.top = this.y + 'px';
    brickElement.style.width = this.width + 'px';
    brickElement.style.height = this.height + 'px';
  }

  private getBrickElement(): HTMLElement {
    return document.querySelector('.brick') as HTMLElement;
  }
}