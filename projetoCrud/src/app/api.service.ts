import { Injectable } from '@angular/core';

import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map, retry } from 'rxjs/operators';
import { Product } from './product';

const apiUrl = "http://vcmobile.com.br/VictorProjetoEstagio/Hackathon/WebApi/V01/Produtos_SelecionarTodos_Get";
const testUrl = "http://vcmobile.com.br/VictorProjetoEstagio/Hackathon/WebApi/V01/Produtos_Selecionar_Get";
const tst2Url = "http://vcmobile.com.br/VictorProjetoEstagio/Hackathon/WebApi/V01/Produtos_Alterar_Post";
const tst3Url = "http://vcmobile.com.br/VictorProjetoEstagio/Hackathon/WebApi/V01/Produtos_Incluir_Post";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  // Headers
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  //Obter produtos (por completo)
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(apiUrl)
      .pipe(
        tap(product => console.log('Buscando produtos...')),
        //catchError(this.handleError('getProducts', []))
      );
  }

  //Obter protuto pelo id
  getProduct(id: string): Observable<Product> {
    const url = `${testUrl}/${id}`;
    return this.http.get<Product>(url).pipe(
      tap(_ => console.log(`Buscando produto id=${id}`)),
      catchError(this.handleError)
    );
  }
  
  //Adicionar um novo produto
  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(tst3Url, JSON.stringify(product), this.httpOptions)
    .pipe(
      retry(2),
      tap((prod: Product) => console.log(`Adicionado produto com id = ${product.TABPROD_seq_tabprod}`)),
      catchError(this.handleError)
    );
  }
  
  //Atualizar um produto
  updateProduct(id: any, product: Product): Observable<any> {
    const url = `${tst2Url}/${id}`;
    return this.http.put(url, product, this.httpOptions).pipe(
      tap(_ => console.log(`Atualizado produto com id = ${id}`)),
      catchError(this.handleError)
    );
  }
  
  //Excluir um produto
  deleteProduct(id: any): Observable<Product> {
    const url = `${testUrl}/${id}`;
    return this.http.delete<Product>(url, this.httpOptions).pipe(
      tap(_ => console.log(`Deletado produto com id = ${id}`)),
      catchError(this.handleError)
    );
  }

  // Manipulação de erros
  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado do client
      errorMessage = error.error.message;
    } else {
      // Erro ocorreu no lado do servidor
      errorMessage = `Código do erro: ${error.status}, ` + `menssagem: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  };
}
