import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { CreateAccountComponent } from './pages/create-account/create-account.component';
import { ViewMnemonicComponent } from './pages/view-mnemonic/view-mnemonic.component';
import { InventoryComponent } from './pages/inventory/inventory.component';

const routes: Routes = [
	{path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'create-account', component: CreateAccountComponent},
	{path: 'home', component: HomeComponent},
  {path: 'mnemonic', component: ViewMnemonicComponent},
  {path: 'inventory', component: InventoryComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, ({useHash: true}))
  ],
  declarations: [],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
