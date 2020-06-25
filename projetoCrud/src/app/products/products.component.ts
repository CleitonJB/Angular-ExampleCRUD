import { Component, OnInit } from '@angular/core';

import { ApiService } from '../api.service';

import { Product } from '../product';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  //Pegando os dados especificos baseando-se no retorno dado pelo server. Não pelo modelo(product.ts)
  displayedColumns: string[] = ['TABPROD_seq_tabprod', 'TABPROD_desc', 'dat_inclusao'];   
  //Solicita dados ao server baseando-se no modelo(product.ts)
  data: Product[] = [];
  isLoadingResults = true;

  constructor(private api: ApiService) { }

  ngOnInit() {
    //Mostra o resultado(campos do produto) no console. Baseado no server
    this.api.getProducts()
      .subscribe((res: any) => {
        this.data = res;
        console.log(this.data);
        this.isLoadingResults = false;
      }, err => {
        console.log(err);
        this.isLoadingResults = false;
      });
  }

}