import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AuthComponent } from './pages/auth/auth/auth.component';
import { FileUploadComponent } from './pages/file-upload/file-upload.component';
import { AccountComponent } from './pages/auth/account/account.component';
import { AppComponent } from './app.component';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'router', component: AppComponent },
  { path: 'sign-in', component: AuthComponent },
  { path: 'file', component: FileUploadComponent, canActivate: [authGuard]},
  { path: 'account', component: AccountComponent},
  { path: '', redirectTo: 'router', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }