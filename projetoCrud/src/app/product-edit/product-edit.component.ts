import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

import { ErrorStateMatcher } from '@angular/material/core';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {

  matcher = new MyErrorStateMatcher();

  productForm: FormGroup;
  //Usando como referência de 'id' e como identificador de valor para input no html
  TABPROD_seq_tabprod: number = null;
  TABPROD_desc = '';
  
  isLoadingResults = false;

  constructor(private router: Router, private route: ActivatedRoute, private api: ApiService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.getProduct(this.route.snapshot.params['id']);
    //Caso algum campo do formulário esteja vazio informar uma mensagem de erro
    this.productForm = this.formBuilder.group({
      'TABPROD_seq_tabprod' : [null, Validators.required],
      'TABPROD_desc' : [null, Validators.required],
    });
  }

  getProduct(id: any) {
    this.api.getProduct(id).subscribe((data: any) => {
      this.TABPROD_seq_tabprod = data.TABPROD_seq_tabprod;
      //Os campos do formulário html recebe os referentes valores da resposta do server
      this.productForm.setValue({
        TABPROD_seq_tabprod   : data.TABPROD_seq_tabprod,
        TABPROD_desc          : data.TABPROD_desc,
      });
    });
  }

  onFormSubmit() {
    this.isLoadingResults = true;
    this.api.updateProduct(this.TABPROD_seq_tabprod, this.productForm.value).subscribe((res: any) => {
        const id = res.TABPROD_seq_tabprod;
        this.isLoadingResults = false;
        this.router.navigate(['/product-details', id]);
      }, (err: any) => {
        console.log(err);
        this.isLoadingResults = false;
      }
    );
  }

  productDetails() {
    this.router.navigate(['/product-details', this.TABPROD_seq_tabprod]);
  }

}
