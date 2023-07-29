import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ball',
  templateUrl: './ball.component.html',
  styleUrls: ['./ball.component.scss']
})
export class BallComponent {

  @Input()
  x!: number; // X position of the ball
  @Input()
  y!: number; // Y position of the ball
  @Input()
  radius!: number; // Radius of the ball
}
