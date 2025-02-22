import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../book';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  books_url = 'http://localhost:3000/api/books';
  roles_url = 'http://localhost:3000/api/roles';
  reviews_url = 'http://localhost:3000/api/reviews';
  genres_url = 'http://localhost:3000/api/genres';
  favorites_url = 'http://localhost:3000/api/favorites';

  constructor(private http: HttpClient) { }

  getBookById(id: string) {
    return this.http.get<Book>(this.books_url + "/" + id);
  }

  getBookAverageRating(id: string): Observable<any> {
    return this.http.get(this.books_url + "/" + id + "/average");
  }

  getBookReviews(id: string): Observable<any> {
    return this.http.get(this.books_url + "/" + id + "/reviews");
  }

  getBooks(paramList: {
    title?: string,
    author?: string,
    genres?: string[],
    order?: string,
    o?: boolean
  }): Observable<any> {
    let httpParams = new HttpParams();
    if (paramList.title) httpParams = httpParams.append("title", paramList.title);
    if (paramList.author) httpParams = httpParams.append("author", paramList.author);
    if (paramList.genres && paramList.genres.length >= 1) httpParams = httpParams.append("genres", paramList.genres.join(","));
    if (paramList.order) httpParams = httpParams.append("order", paramList.order);
    if (paramList.o === false) httpParams = httpParams.append("o", "-1");
    if (paramList.o === true) httpParams = httpParams.append("o", "1");

    return this.http.get<Book[]>(this.books_url, { params: httpParams });
  }

  addBook(body: {
    title: string,
    authors: string,
    published: string,
    description: string,
    genres: string[]
  }) {
    return this.http.post(this.books_url, body, { headers: { 'Content-Type': 'application/json' } });
  }

  addReview(body: {
    user_id: string,
    username: string,
    book_id: string,
    stars: number,
    review: string,
  }){
    return this.http.post(this.reviews_url, body, { headers: { 'Content-Type': 'application/json' } });
  }

  updateBook(id: string, body: {
    title: string,
    authors: string,
    published: string,
    description: string,
    genres: string[]
  }) {
    return this.http.put<Book>(this.books_url + "/" + id, body)
  }

  deleteBook(id: string) {
    return this.http.delete<Book>(this.books_url + "/" + id);
  }

  getUserRole(id: string) {
    return this.http.get<{ user_id: string, role: string }>(this.roles_url + "/" + id);
  }

  addUserRole(body: {
    user_id: string,
    role: string
  }) {
    this.http.post(this.roles_url, body);
  }

  getGenres(): Observable<any>{
    return this.http.get(this.genres_url);
  }
}
