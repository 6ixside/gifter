import { ShopifyPluginComponent } from './shopify-plugin/shopify-plugin.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { provideRoutes, RouterModule, Routes} from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialSharedModule } from './material-shared/material-shared.module';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { CreateAccountComponent } from './pages/create-account/create-account.component';
import { HomeComponent } from './pages/home/home.component';
import { HeaderComponent } from './header/header.component';
import { TabNavComponent } from './tab-nav/tab-nav.component';
import { FriendBarComponent } from './friend-bar/friend-bar.component';

import { AccountService } from './shared/services/account.service';
import { CardService } from './shared/services/card.service';
import { CreateAccountModalComponent } from './pages/create-account-modal/create-account-modal.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { ViewMnemonicComponent } from './pages/view-mnemonic/view-mnemonic.component';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    TabNavComponent,
    FriendBarComponent,
    CreateAccountComponent,
    CreateAccountModalComponent,
    InventoryComponent,
    ViewMnemonicComponent,
    ConfirmationModalComponent,
    ShopifyPluginComponent
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
  entryComponents: [CreateAccountModalComponent,
                    ConfirmationModalComponent]
})
export class AppModule { }
