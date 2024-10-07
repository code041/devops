import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicoService {

constructor(
  private http: HttpClient
){}

get(): Observable<string> {
  const url = `http://localhost:5000/`;
  return this.http.get(url, { responseType: 'text' }); 

}

}