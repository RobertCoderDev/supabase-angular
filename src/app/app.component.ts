import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { AuthService } from './services/auth.service';
import { AccountComponent } from './pages/auth/account/account.component';
import { AuthComponent } from './pages/auth/auth/auth.component';
import { Session } from '@supabase/supabase-js';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, AccountComponent, AuthComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'supabase-demo';
  session: Session | null = null;

  constructor(private readonly authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.authChanges((event, session) => {
      if (session) {
        this.router.navigate(['/file']);
      }else{
        this.router.navigate(['/home']);
      }
    })
  }
  

}