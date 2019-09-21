import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TitleComponent } from './components/title/title.component';
import { HomeComponent } from './components/home/home.component';
import { LedComponent } from './components/leds/led.component';
import { ContainerComponent } from './components/leds/container.component';
import { OptionsComponent } from './components/options/options.component';
import { DisplayerComponent } from './components/sequence/displayer.component';
import { PopUpComponent } from './components/pop-up/pop-up.component';
import { DemoPlayerComponent } from './components/demo-player/demo-player.component';
import { SaveComponent } from './components/save/save.component';
import { MessagesBoxComponent } from './components/messages-box/messages-box.component';
import { LoadComponent } from './components/load/load.component';
import { LoaderComponent } from './components/sequence/loader.component';

@NgModule({
  declarations: [
    AppComponent,
    TitleComponent,
    HomeComponent,
    LedComponent,
    ContainerComponent,
    OptionsComponent,
    DisplayerComponent,
    PopUpComponent,
    DemoPlayerComponent,
    SaveComponent,
    MessagesBoxComponent,
    LoadComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
