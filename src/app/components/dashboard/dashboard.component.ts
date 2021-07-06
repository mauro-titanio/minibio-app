import { formatCurrency } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';

import { Link } from 'src/app/shared/models/link';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { LinksCrudService } from 'src/app/shared/services/crud/links-crud.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  formLink: FormGroup
  user: any
  userLinks: Array<Link> = []
  userLink: Link = {
    id: '',
    author: '',
    label: '',
    link_url: '',
    active: true,
    date: 0,
  }
  pageLoaded = false
  createLinkModalClosed = true
  linksActives: Array<Link> | undefined


  constructor(private authService: AuthService,
    private crudLinks: LinksCrudService,
    private fb: FormBuilder,
    private notifier: NotifierService) {

    const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    this.formLink = this.fb.group({
      label: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      linkUrl: ['', [Validators.required, Validators.pattern(reg)]],
      active: [true, Validators.required]
    })

  }



  ngOnInit(): void {
    this.user = this.authService.userData()
    console.log(this.user)
    this.readAllLinks()
    setTimeout(() => {
      this.pageLoaded = true
    }, 100);
    console.log(this.linksActives)
  }


  get f() {
    return this.formLink.controls
  }

 

  createLink(): void {
    const link: Link = {
      id: '',
      author: this.user.uid,
      label: this.f.label.value,
      link_url: this.f.linkUrl.value,
      active: true,
      date: new Date().getTime()
    }
    this.createLinkModalClosed = false
    if (this.formLink.invalid) {
      console.log("error!")
      this.notifier.notify('error', 'El enlace no es válido');
      return
    }
    if (this.userLinks.some(link => link.label === this.f.label.value)) {
      this.notifier.notify('error', 'El nombre ya existe');
      return
    }
    if (this.userLinks.some(link => link.link_url === this.f.linkUrl.value)) {
      this.notifier.notify('error', 'El enlace ya existe');
      return
    }
    this.crudLinks.newLink(link, this.user.uid).then(success => {
      console.log("Post creado", success)
      this.notifier.notify('success', 'Enlace creado');
      this.readAllLinks()
      this.createLinkModalClosed = true
    }).catch(error => {
      console.log("Error", error)
      this.notifier.notify('error', 'Ha habido un error en el servidor');
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
          this.linksActives = this.userLinks.filter(link => link.active === true)
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
      console.log("Esto es userLink: ", this.userLink)
      this.formLink.patchValue({
        label: this.userLink.label,
        linkUrl: this.userLink.link_url,
        active: this.userLink.active,
      })
    })
  }



  deleteLink(id: any) {
    this.crudLinks.deleteLink(this.user.uid, id).then(success => {
      console.log("Se ha eliminado ",this.userLink)
      this.notifier.notify('success', 'Enlace eliminado');
      this.readAllLinks()
    }).catch(error => {
      console.log("Error", error)
      this.notifier.notify('error', 'Ha habido un error en el servidor');
    })
  /*  this.userLink = {
      id: '',
      author: '',
      label: '',
      link_url: '',
      active: true,
      date: 0,
    }*/
  }





  //Hay un error en el update
  updateLink(id: string) {
    console.log("El estado es este" , this.f.active.value)
    let link: Link = {
      id: id,
      author: this.user.uid,
      label: this.f.label.value,
      link_url: this.f.linkUrl.value,
      active: this.f.active.value,
      date: new Date().getTime(),
    }
    if (this.formLink.invalid) {
      this.notifier.notify('error', 'No se ha podido actualizar');
      console.log("error!")
      return
    }
    this.crudLinks.updateLink(this.user.uid, link, id).then(success => {
      this.notifier.notify('success', 'Enlace actualizado');
      console.log("Post creado", success)
      this.readAllLinks()
      /* this.userLink = {
         id: '',
         author: '',
         label: '',
         link_url: '',
         active: true,
         date: 0,
       }*/
      
    }).catch(error => {
      this.notifier.notify('error', 'Ha habido un error en el servidor');
      console.log("Error", error)
    })
  }



  logout() {
    this.authService.signOut()
  }





}



