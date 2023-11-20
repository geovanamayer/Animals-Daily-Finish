import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Contato } from 'src/app/model/entities/Contato';
import { AuthService } from 'src/app/model/services/auth.service';
import { FirebaseService } from 'src/app/model/services/firebase.service';

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.page.html',
  styleUrls: ['./cadastrar.page.scss'],
})
export class CadastrarPage implements OnInit {
  public nome! : string;
  public comentario! : string;

  // public telefone! : number;
  // public email! : string;
  public genero! : number;
  public especie!: number;
  public ! : number;


  public imagem : any;
  user : any;
  constructor(private alertController: AlertController,
    private auth : AuthService,
    private router : Router, private firebase : FirebaseService) {
      this.user = this.auth.getUsuarioLogado();
    }

  ngOnInit() {
  }

  uploadFile(imagem: any){
    this.imagem = imagem.files;
  }

  cadastrar(){
    if(this.nome){
      let novo : Contato = new Contato(this.nome);
      // novo.email = this.email;
      novo.comentario = this.comentario;

      novo.genero = this.genero;
      novo.especie = this.especie;

      novo.uid = this.user.uid;
      if(this.imagem){
        this.firebase.uploadImage(this.imagem, novo)
        ?.then(()=> {
          this.router.navigate(["/home"]);
        })
      }else{
        this.firebase.cadastrar(novo)
        .then(() =>  this.router.navigate(["/home"]))
        .catch((error) => {
          console.log(error);
          this.presentAlert("Erro", "Erro ao salvar contato!");
        })
      }
    }else{
      this.presentAlert("Erro", "Nome e um campo obrigatorio");
    }
  }

  async presentAlert(subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: 'Agenda de Contatos',
      subHeader: subHeader,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
