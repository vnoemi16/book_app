import { inject, Injectable, signal } from "@angular/core";
import { Auth, user, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut } from "@angular/fire/auth";
import { Observable, from } from "rxjs";
import { DataService } from "./data.service";

export enum Role{
    ADMIN = "ADMIN",
    USER = "USER"
}

export interface UserInterface {
    email: string;
    username: string;
    id: string;
    role: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService{
    firebaseAuth = inject(Auth);
    dataService = inject(DataService);
    user$ = user(this.firebaseAuth);
    currentUserSig = signal<UserInterface | null | undefined>(undefined);

    signUp(email: string,  username: string, password: string): Observable<void> {
        const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password)
        .then(response => {
            updateProfile(response.user, {displayName: username});
            this.dataService.addUserRole({user_id: response.user.uid, role: "user"});
        });
        return from(promise);
    }

    login(email: string, password: string): Observable<void>{
        const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password)
        .then(() => {});
        return from(promise);
    }

    logout(): Observable<void>{
        const promise = signOut(this.firebaseAuth);
        return from(promise);
    }

    async getUserId(): Promise<string | null> {
        const user =  this.firebaseAuth.currentUser;
        return user ? user.uid : null;
    }
}