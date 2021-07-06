import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Link } from '../../models/link';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LinksCrudService {

  

  constructor(private fireStore: AngularFirestore, private authService: AuthService) { }




//Crear un objetoo en la collección
newLink(data: any, userID:string) {
  return this.fireStore.collection('users').doc(userID).collection('user_links').add(data)
  
}
//Leer toda la collección
readAllLinks(userID: string){
  return this.fireStore.collection('users').doc(userID).collection('user_links').get()
}
//Leer un link en especifico
getLink(id:string,linkID: string ){
  return this.fireStore.collection('users').doc(id).collection('user_links').doc(linkID).get()
}
//Modificar un link
updateLink(userID:string, data:Link, linkID: string){
  return this.fireStore.collection('users').doc(userID).collection('user_links').doc(linkID).update(data)
}
//Eliminar un link
deleteLink(userID:string, linkID:string){
  return this.fireStore.collection('users').doc(userID).collection('user_links').doc(linkID).delete()
}

getMiniBio(id:string){
  return this.fireStore.collection('users').doc(id).collection('miniBio').get()
}








}
