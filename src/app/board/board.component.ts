import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

interface Brick {
  x: number;
  y: number;
  status: number;
}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  // Game properties
  canvasWidth: number = 800;
  canvasHeight: number = 600;
  paddleWidth: number = 100;
  paddleHeight: number = 10;
  ballRadius: number = 8;

  paddleSpeed: number = 5;
  brickRowCount = 3;
  brickColumnCount = 5;
  brickWidth = 75;
  brickHeight = 20;
  brickPadding = 10;
  brickOffsetTop = 30;
  brickOffsetLeft = 30;
  bricks: Brick[][] = [];


  // Game state
  canvas!: HTMLCanvasElement;
  paddleX: number = 400;
  ballX: number = 400;
  ballY: number = 400;

  ballSpeedX: number = 0.5;
  ballSpeedY: number = -0.5;

  @ViewChild('gameCanvas', { static: true }) gameCanvasRef!: ElementRef<HTMLCanvasElement>;
  private context: CanvasRenderingContext2D | null;

  // Game loop
  private animationFrameId!: number;

  constructor() {
    this.context = {} as CanvasRenderingContext2D;
  }

  // Flag to track if the cursor is over the paddle
  private isCursorOverPaddle = false;



  // Method to update the paddle position (called from drawGame method)
  private updatePaddlePosition(mouseX: number): void {
    // Move the paddle to the cursor's x-coordinate
    this.paddleX = mouseX - this.paddleWidth / 2;

    // Limit paddle movement within the canvas
    this.paddleX = Math.max(0, Math.min(this.paddleX, this.canvasWidth - this.paddleWidth));
  }

  ngOnInit(): void {
    // Initialize the canvas and context
    this.canvas = this.gameCanvasRef.nativeElement;
    this.context = this.canvas.getContext('2d');

    // Set initial paddle and ball positions
    this.paddleX = 500;
    this.ballX = this.canvasWidth / 2;
    this.ballY = this.canvasHeight - this.paddleHeight - this.ballRadius;

    // Initialize the brick matrix
    this.initializeBricks();
    // Start the game loop
    this.gameLoop(5);
  }

  private initializeBricks(): void {
    for (let row = 0; row < this.brickRowCount; row++) {
      this.bricks[row] = [];
      for (let col = 0; col < this.brickColumnCount; col++) {
        const brickX = col * (this.brickWidth + this.brickPadding) + this.brickOffsetLeft;
        const brickY = row * (this.brickHeight + this.brickPadding) + this.brickOffsetTop;
        this.bricks[row][col] = { x: brickX, y: brickY, status: 1 };
      }
    }
  }

  private drawGame(): void {
    this.clearCanvas();

    // Draw the 'ball' component with updated position (x, y) and radius properties
    this.ballX += this.ballSpeedX; // Update ball's x position based on dx
    this.ballY += this.ballSpeedY; // Update ball's y position based on dy

    // Draw the 'ball' component with updated position (x, y) and radius properties

    if (this.context) {
      this.context.beginPath();
      this.context.arc(this.ballX, this.ballY, this.ballRadius, 0, Math.PI * 2);
      this.context.fillStyle = 'red';
      this.context.fill();
      this.context.closePath();
    }

    // Handle collisions and ball movement logic
    this.collisionDetection();
    // Request animation frame for the next game loop iteration
    requestAnimationFrame(() => this.drawGame());
  }

  private clearCanvas(): void {
    if (this.context)
      this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  private detectBrickCollision(ballCenterX: number, ballCenterY: number): void {
    for (let row = 0; row < this.brickRowCount; row++) {
      for (let col = 0; col < this.brickColumnCount; col++) {
        const brick = this.bricks[row][col];
        if (brick.status === 1) {
          // Calculate the coordinates of the edges of the brick
          const brickLeft = brick.x;
          const brickRight = brick.x + this.brickWidth;
          const brickTop = brick.y;
          const brickBottom = brick.y + this.brickHeight;

          // Check for collision with each visible brick
          if (
            ballCenterX + this.ballRadius > brickLeft &&
            ballCenterX - this.ballRadius < brickRight &&
            ballCenterY + this.ballRadius > brickTop &&
            ballCenterY - this.ballRadius < brickBottom
          ) {
            // Ball collided with the brick
            brick.status = 0; // Mark the brick as broken (invisible)
            if(this.ballSpeedY === -0.5) this.ballSpeedY = 0.5;
            else this.ballSpeedY = -0.5; // Reverse the ball's y-direction
          }
        }
      }
    }
  }

  private collisionDetection(): void {
    // Calculate the center of the ball
    const ballCenterX = this.ballX + this.ballRadius;
    const ballCenterY = this.ballY + this.ballRadius;

    // Check for collisions with the paddle
    if (
      ballCenterX > this.paddleX &&
      ballCenterX < this.paddleX + this.paddleWidth &&
      ballCenterY > this.canvasHeight - this.paddleHeight - this.ballRadius
    ) {
      // Collision with the paddle detected, change the ball's direction
      if(this.ballSpeedY === -0.5) this.ballSpeedY = 0.5;
      else this.ballSpeedY = -0.5; // Reverse the vertical direction
    }

    // Check for collisions with the bricks

    this.detectBrickCollision(ballCenterX, ballCenterY);

    // Check for collisions with the canvas walls (left and right)
    if (this.ballX + this.ballRadius > this.canvasWidth || this.ballX - this.ballRadius < 0) {
      if(this.ballSpeedX === -0.5) this.ballSpeedX = 0.5;
      else this.ballSpeedX = -0.5; // Reverse the horizontal direction
    }

    // Check for collisions with the canvas ceiling (top)
    if (this.ballY - this.ballRadius < 0 || this.ballY + this.ballRadius > this.canvasHeight) {
      if(this.ballSpeedY === -0.5) this.ballSpeedY = 0.5;
      else this.ballSpeedY = -0.5; // Reverse the vertical direction
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    const canvasOffset = this.gameCanvasRef.nativeElement.getBoundingClientRect();
    const relativeX = event.clientX - canvasOffset.left;
    this.isCursorOverPaddle = relativeX >= this.paddleX && relativeX <= this.paddleWidth + this.paddleX;

    if (this.isCursorOverPaddle) {
      this.updatePaddlePosition(relativeX);
    }
  }

  private gameLoop(ts: number): void {
    this.drawGame();
    this.animationFrameId = requestAnimationFrame((ts) => this.gameLoop(ts));
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationFrameId);
  }
}



