import { Inject, Injectable, Injector } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Contato } from '../entities/Contato';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private PATH : string = "contatos";
  user : any;

  constructor(private firestore : AngularFirestore,
   @Inject(Injector) private readonly injector : Injector,
    private storage : AngularFireStorage) { }

    private injectAuthService(){
     return this.injector.get(AuthService);
    }

  buscarTodos(){
    this.user = this.injectAuthService().getUsuarioLogado();
    return this.firestore.collection(this.PATH,
       ref => ref.where('uid','==', this.user.uid)).snapshotChanges();
  }

  cadastrar(contato: Contato){
    return this.firestore.collection(this.PATH)
    .add({nome : contato.nome, genero : contato.genero,especie: contato.especie,comentario :contato.comentario,
    downloadURL : contato.downloadURL, uid : contato.uid});
  }

  editar(contato: Contato, id : string){
    return this.firestore.collection(this.PATH).doc(id)
    .update({nome : contato.nome, genero : contato.genero,especie: contato.especie,comentario :contato.comentario,
      downloadURL : contato.downloadURL, uid : contato.uid});
  }


  excluir(id: string){
    return this.firestore.collection(this.PATH).doc(id)
    .delete();
  }

  uploadImage(imagem: any, contato: Contato){
    const file = imagem.item(0);
    if(file.type.split('/')[0] !== 'image'){
      console.error("Tipo Não Suportado");
      return;
    }
    const path = `images/${contato.nome}_${file.name}`;
    const fileRef = this.storage.ref(path);
    let task = this.storage.upload(path,file);
    task.snapshotChanges().pipe(
      finalize(()=>{
        let uploadFileURL = fileRef.getDownloadURL();
        uploadFileURL.subscribe(resp => {
          contato.downloadURL = resp;
          if(!contato.id){
            this.cadastrar(contato);
          }else{
            this.editar(contato, contato.id);
          }
        })
      })
    ).subscribe();
    return task;
  }

}
