import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../book';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  url = 'http://localhost:3000/api/books'

  constructor(private http: HttpClient) { }

  getBookById(id: string){
    return this.http.get<Book>(this.url + "/" + id);
  }

  getBooks(paramList: {
    title?: string,
    author?: string,
    genres?: string[],
    dateOrder?: boolean,
    titleOrder?: boolean,
    o?: number
  }): Observable<any> {
    let httpParams = new HttpParams();
    if (paramList.title) httpParams = httpParams.append("title", paramList.title);
    if (paramList.author) httpParams = httpParams.append("author", paramList.author);
    if (paramList.genres && paramList.genres.length >= 1) httpParams = httpParams.append("genres", paramList.genres.join(","));
    if (paramList.dateOrder) httpParams = httpParams.append("dateOrder", paramList.dateOrder);
    if (paramList.titleOrder) httpParams = httpParams.append("titleOrder", paramList.titleOrder);
    if (paramList.o) httpParams = httpParams.append("o", paramList.o);

    console.log(httpParams.toString());

    return this.http.get<Book[]>(this.url, {params: httpParams});
  }

  addBook(body: {
    title: string,
    authors: string[],
    published: Date,
    description: string,
    genres: string[]
  }) {
    this.http.post<Book>(this.url, body);
  }

  updateBook(id: string, body: {
    title: string | undefined,
    authors: string[] | undefined,
    published: Date | undefined,
    description: string | undefined,
    genres: string[] | undefined
  }){
    this.http.put<Book>(this.url + "/" + id, body)
  }

  deleteBook(id: string) {
    this.http.delete<Book>(this.url + "/" + id);
  }
}
