import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-paddle',
  templateUrl: './paddle.component.html',
  styleUrls: ['./paddle.component.scss']
})
export class PaddleComponent {
  @Input()
  x!: number; // X position of the paddle
  @Input()
  y!: number; // Y position of the paddle
  @Input()
  width!: number; // Width of the paddle
  @Input()
  height!: number; // Height of the paddle

}