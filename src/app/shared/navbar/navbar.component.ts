import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Session } from '@supabase/supabase-js';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  session: Session | null = null;
  isLogin: boolean = false;



  constructor(private readonly authService: AuthService) { }

  ngOnInit() {
    this.authService.authChanges((event, session) => {
      if (session) {
        this.isLogin = true;
      }
    })
  }

  signOut() {
    this.authService.signOut().then(() => {
      this.isLogin = false;
    });
  }

}