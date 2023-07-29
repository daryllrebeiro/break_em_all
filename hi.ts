hi.ts
import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';

@Component({
selector: 'app-game-board',
templateUrl: './game-board.component.html',
styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {
// Game properties
canvasWidth: number = 800;
canvasHeight: number = 600;
paddleWidth: number = 100;
paddleHeight: number = 10;
ballRadius: number = 8;
ballSpeedX: number = 4;
ballSpeedY: number = -4;
paddleSpeed: number = 8;
brickRowCount: number = 3;
brickColumnCount: number = 5;
brickWidth: number = 100;
brickHeight: number = 30;
brickPadding: number = 10;
brickOffsetTop: number = 30;
brickOffsetLeft: number = 30;

// Game state
private canvas: HTMLCanvasElement;
private context: CanvasRenderingContext2D;
private paddleX: number;
private ballX: number;
private ballY: number;

// Brick matrix to keep track of brick positions
private bricks: boolean[][];

// Game loop
private animationFrameId: number;

ngOnInit(): void {
// Initialize the canvas and context
this.canvas = this.gameCanvasRef.nativeElement;
this.context = this.canvas.getContext('2d');

// Set initial paddle and ball positions
this.paddleX = (this.canvasWidth - this.paddleWidth) / 2;
this.ballX = this.canvasWidth / 2;
this.ballY = this.canvasHeight - this.paddleHeight - this.ballRadius;

// Initialize the brick matrix
this.initializeBricks();

// Start the game loop
this.gameLoop();
}

private initializeBricks(): void {
this.bricks = new Array(this.brickRowCount);
for (let row = 0; row < this.brickRowCount; row++) {
this.bricks[row] = new Array(this.brickColumnCount).fill(true);
}
}

private drawGame(): void {
this.clearCanvas();
this.drawBricks();
this.drawPaddle();
this.drawBall();
this.collisionDetection();
}

private clearCanvas(): void {
this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
}

private drawBricks(): void {
for (let row = 0; row < this.brickRowCount; row++) {
for (let col = 0; col < this.brickColumnCount; col++) {
if (this.bricks[row][col]) {
const brickX = col * (this.brickWidth + this.brickPadding) + this.brickOffsetLeft;
const brickY = row * (this.brickHeight + this.brickPadding) + this.brickOffsetTop;

this.context.beginPath();
this.context.rect(brickX, brickY, this.brickWidth, this.brickHeight);
this.context.fillStyle = '#0095DD';
this.context.fill();
this.context.closePath();
}
}
}
}

private drawPaddle(): void {
this.context.beginPath();
this.context.rect(this.paddleX, this.canvasHeight - this.paddleHeight, this.paddleWidth, this.paddleHeight);
this.context.fillStyle = '#0095DD';
this.context.fill();
this.context.closePath();
}

private drawBall(): void {
this.context.beginPath();
this.context.arc(this.ballX, this.ballY, this.ballRadius, 0, Math.PI * 2);
this.context.fillStyle = '#0095DD';
this.context.fill();
this.context.closePath();
}

private collisionDetection(): void {
// Collision with bricks
for (let row = 0; row < this.brickRowCount; row++) {
for (let col = 0; col < this.brickColumnCount; col++) {
if (this.bricks[row][col]) {
const brickX = col * (this.brickWidth + this.brickPadding) + this.brickOffsetLeft;
const brickY = row * (this.brickHeight + this.brickPadding) + this.brickOffsetTop;

if (
this.ballX > brickX &&
this.ballX < brickX + this.brickWidth &&
this.ballY > brickY &&
this.ballY < brickY + this.brickHeight
) {
this.ballSpeedY = -this.ballSpeedY;
this.bricks[row][col] = false;
}
}
}
}

// Collision with walls
if (this.ballX + this.ballSpeedX > this.canvasWidth - this.ballRadius || this.ballX + this.ballSpeedX < this.ballRadius) {
this.ballSpeedX = -this.ballSpeedX;
}

if (this.ballY + this.ballSpeedY < this.ballRadius) {
this.ballSpeedY = -this.ballSpeedY;
} else if (this.ballY + this.ballSpeedY > this.canvasHeight - this.ballRadius) {
// Collision with paddle
if (this.ballX > this.paddleX && this.ballX < this.paddleX + this.paddleWidth) {
this.ballSpeedY = -this.ballSpeedY;
} else {
// Game over
cancelAnimationFrame(this.animationFrameId);
alert('Game Over!');
}
}

// Update ball position
this.ballX += this.ballSpeedX;
this.ballY += this.ballSpeedY;
}

@HostListener('document:mousemove', ['$event'])
onMouseMove(event: MouseEvent): void {
const rect = this.canvas.getBoundingClientRect();
this.paddleX = event.clientX - rect.left - this.paddleWidth / 2;
}

private gameLoop(): void {
this.drawGame();
this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
}

ngOnDestroy(): void {
cancelAnimationFrame(this.animationFrameId);
}
}