import { formatCurrency } from '@angular/common';
import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';

import { Observable } from 'rxjs';
import { Link } from 'src/app/shared/models/link';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { LinksCrudService } from 'src/app/shared/services/crud/links-crud.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {





  user: any
  userLinks: Array<Link> = []
  userLink: Link = {
    id: '',
    author: '',
    label: '',
    link_url: '',
    active: false,
  }
  form = this.fb.group({})



  get linksForm() {
    return this.form.get('linksForm') as FormArray
  }


  constructor(private authService: AuthService,
    private fire: AngularFirestore,
    private crudLinks: LinksCrudService,
    private fb: FormBuilder) {
      this.readAllLinks()
  }


  ngOnInit(): void {
    this.user = this.authService.userData()
    console.log(this.user)
  
  }


  //Crear un nuevo formgroup en el form array



  //Crear un nuevo
  createLink(): void {
    const link: Link = {
      id: '',
      author: '',
      label: '',
      link_url: '',
      active: false,
    }
    this.crudLinks.newLink(link, this.user.uid).then(success => {
      console.log("Post creado", success)
    }).catch(error => {
      console.log("Error", error)
    })
    this.readAllLinks()
  }




  readAllLinks() {
    setTimeout(() => {
      this.crudLinks.readAllLinks(this.user.uid).subscribe(data => {
        this.userLinks = []
        data.forEach((doc: any) => {
          let userLink: Link = doc.data()
          userLink.id = doc.id
          this.userLinks.push(userLink)
          //Tengo que arreglar algo: cuando imprimo los "userLinks" hay muchos arrays, será por el forEach
          console.log(this.userLinks)
        })
      })
    }, 150);
  }


  getLink(id: string) {
 //////FILTER?

    this.crudLinks.getLink(this.user.uid, id).subscribe((data:any)=>{
      this.userLink = data.data()
      console.log(this.userLink)
    })
  }




  deleteLink(id: any) {
    this.crudLinks.deleteLink(this.user.uid, id).then(success => {
      console.log("Se ha eliminado")
      this.readAllLinks()
    }).catch(error => {
      console.log("Error", error)
    })
  }


  updateLink(id: string) {
    console.log('funciona?')
    const link: Link = {
      id: id,
      author: this.user.uid,
      label: this.f.label.value,
      link_url: this.f.link_url.value,
      active: true,
    }
    this.crudLinks.updateLink(this.user.uid, link, id).then(success => {
      console.log("Post creado", success)
    }).catch(error => {
      console.log("Error", error)
    })
    this.readAllLinks()
  }

  get f() {
    return this.form.controls
  }





  logout() {
    this.authService.signOut()
  }





}



