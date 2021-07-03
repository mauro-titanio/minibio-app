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
newLink(data: Link, userID:string) {
  return this.fireStore.collection('users').doc(userID).collection('user_links').add(data)
  //Poniendo .add() genera id automatico
}
//Leer toda la collección
readAllLinks(userID: string){
//????????
  return this.fireStore.collection('users').doc(userID).collection('user_links').get()
}
//Leer un post en especifico
getLink(id:string){
  return this.fireStore.collection('users/${user.uid}/user_links').doc(id).get()
}
//Modificar un post
updateLink(userID:string, data:Link, linkID: string){
  return this.fireStore.collection('users').doc(userID).collection('user_links').doc(linkID).update(data)
}
//Eliminar un post
deleteLink(userID:string, linkID:string){
  return this.fireStore.collection('users').doc(userID).collection('user_links').doc(linkID).delete()
}










}
