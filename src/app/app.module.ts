import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { BrickComponent } from './brick/brick.component';
import { PaddleComponent } from './paddle/paddle.component';
import { BallComponent } from './ball/ball.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    BrickComponent,
    PaddleComponent,
    BallComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
