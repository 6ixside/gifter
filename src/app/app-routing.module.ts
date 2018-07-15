import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CreateAccountComponent } from './create-account/create-account.component';

const routes: Routes = [
	{path: '', redirectTo: '/create-account', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'create-account', component: CreateAccountComponent}
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