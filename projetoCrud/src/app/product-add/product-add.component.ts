import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

import { ErrorStateMatcher } from '@angular/material/core';

/* Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css']
})

export class ProductAddComponent implements OnInit {

  productForm: FormGroup;
  TABPROD_desc = '';
  isLoadingResults = false;
  matcher = new MyErrorStateMatcher();

  constructor(private router: Router, private api: ApiService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      TABPROD_desc: [null, Validators.required]
    })
  }

  onFormSubmit() {
    this.isLoadingResults = true;
    this.api.addProduct(this.productForm.value).subscribe((res: any) => {
        const id = res.TABPROD_seq_tabprod;
        this.isLoadingResults = false;
        this.router.navigate(['/product-details', id]);
      }, (err: any) => {
        console.log(err);
        this.isLoadingResults = false;
      });   
  }
  
}
