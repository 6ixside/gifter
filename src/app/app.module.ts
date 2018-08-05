import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { provideRoutes, RouterModule, Routes} from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialSharedModule } from './material-shared/material-shared.module';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { TabNavComponent } from './tab-nav/tab-nav.component';
import { FriendBarComponent } from './friend-bar/friend-bar.component';

import { AccountService } from './shared/services/account.service';
import { CardService } from './shared/services/card.service';
import { CreateAccountModalComponent } from './create-account-modal/create-account-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    TabNavComponent,
    FriendBarComponent,
    CreateAccountComponent,
    CreateAccountModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialSharedModule,
    BrowserAnimationsModule
  ],
  providers: [AccountService,
              CardService],
  bootstrap: [AppComponent],
  entryComponents: [CreateAccountModalComponent]
})
export class AppModule { }
