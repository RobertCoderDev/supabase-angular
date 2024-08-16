import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { AuthChangeEvent, createClient, Session, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';

export interface Profile {
  id?: string;
  username: string;
  website: string;
  avatar_url: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private supabase: SupabaseClient;
  private _session: Session | null = null;
  private sessionSubject = new BehaviorSubject<Session | null>(null);


  constructor() {
    this.supabase = createClient(environment.supabase.url, environment.supabase.publicKey);
    this.supabase.auth.getSession().then(({ data }) => {
      this.sessionSubject.next(data.session);
    });
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  get sessionChanges() {
    return this.sessionSubject.asObservable();
  }

  getUserId(): string {
    const session = this.sessionSubject.getValue();
    return session?.user?.id || '';
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange((event, session) => {
      this.sessionSubject.next(session);
      callback(event, session);
    });
  }

  private async initializeSession() {
    const { data } = await this.supabase.auth.getSession();
    this._session = data.session;
  }

  get session(): Session | null {
    return this._session;
  }

  profile(user: User) {
    return this.supabase.from('profiles').select(`username, website, avatar_url`).eq('id', user.id).single();
  }

  signIn(email: string) {
    return this.supabase.auth.signInWithOtp({ email });
  }

  signOut() {
    return this.supabase.auth.signOut();
  }

  updateProfile(profile: Profile) {
    const update = { ...profile, updated_at: new Date() };
    return this.supabase.from('profiles').upsert(update);
  }

  downLoadImage(path: string) {
    return this.supabase.storage.from('avatars').download(path);
  }

  uploadAvatar(filePath: string, file: File) {
    return this.supabase.storage.from('avatars').upload(filePath, file);
  }

  async getSession(): Promise<Session | null> {
    const { data } = await this.supabase.auth.getSession();
    return data.session;
  }


}