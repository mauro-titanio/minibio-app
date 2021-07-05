import { formatCurrency } from '@angular/common';
import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';

import { Link } from 'src/app/shared/models/link';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { LinksCrudService } from 'src/app/shared/services/crud/links-crud.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {



  formCreateLink: FormGroup
  formLink: FormGroup
  user: any
  userLinks: Array<Link> = []
  userLink: Link = {
    id: '',
    author: '',
    label: '',
    link_url: '',
    active: false,
    date: 0,
  }
  pageLoaded = false






  constructor(private authService: AuthService,
    private fire: AngularFirestore,
    private crudLinks: LinksCrudService,
    private fb: FormBuilder) {

    const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    this.formLink = this.fb.group({
      label: ['', Validators.required],
      link_url: ['', [Validators.required, Validators.pattern(reg)]],
      active: [null, Validators.required]
    })
    this.formCreateLink = this.fb.group({
      label: ['', Validators.required],
      link_url: ['', [Validators.required, Validators.pattern(reg)]],
      active: [null, Validators.required]
    })




  }
  get f() {
    return this.formLink.controls
  }
  get t() {
    return this.formLink.controls
  }


  ngOnInit(): void {
    this.user = this.authService.userData()
    console.log(this.user)
    this.readAllLinks()
    setTimeout(() => {
      this.pageLoaded = true
    }, 3000);


  }






  //Crear un nuevo
  createLink(): void {
    const link: Link = {
      id: '',
      author: this.user.uid,
      label: this.t.label.value,
      link_url: this.t.link_url.value,
      active: true,
      date: new Date().getTime()
    }
    this.crudLinks.newLink(link, this.user.uid).then(success => {
      console.log("Post creado", success)
      this.readAllLinks()
    }).catch(error => {
      console.log("Error", error)
    })
  }




  readAllLinks() {
    setTimeout(() => {
      this.crudLinks.readAllLinks(this.user.uid).subscribe(data => {
        this.userLinks = []
        data.forEach((doc: any) => {
          let userLink: Link = doc.data()
          userLink.id = doc.id
          this.userLinks.push(userLink)
          this.userLinks.sort(function (a, b) {
            return b.date - a.date;

          });
        })
      })
    }, 50);

  }


  getLink(id: string) {
    this.crudLinks.getLink(this.user.uid, id).subscribe((data: any) => {
      this.userLink = data.data()
      this.userLink.id = data.id
      console.log(data.id)
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
      date: new Date().getTime(),
    }
    this.crudLinks.updateLink(this.user.uid, link, id).then(success => {
      console.log("Post creado", success)
      console.log(link)
      this.readAllLinks()
    }).catch(error => {
      console.log("Error", error)

    })

  }






  logout() {
    this.authService.signOut()
  }





}



