import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
  provideHttpClient(),
  provideAuth(() => getAuth()), 
  provideFirebaseApp(() => initializeApp(
    { 
      "projectId": "book-app-dc74a", 
      "appId": "1:879822549553:web:7e7e437cdc68e21fc61b10", 
      "storageBucket": "book-app-dc74a.firebasestorage.app", 
      "apiKey": "AIzaSyCeDPuGr9pwwr3H2FGsauRaSmOVIbuFcmI", 
      "authDomain": "book-app-dc74a.firebaseapp.com", 
      "messagingSenderId": "879822549553" 
    })), 
      provideAuth(() => getAuth()),]
};
