import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Contato } from 'src/app/model/entities/Contato';
import { AuthService } from 'src/app/model/services/auth.service';
import { FirebaseService } from 'src/app/model/services/firebase.service';

@Component({
  selector: 'app-detalhar',
  templateUrl: './detalhar.page.html',
  styleUrls: ['./detalhar.page.scss'],
})
export class DetalharPage implements OnInit {
  nome! : string;
  comentario! : string;

  // telefone! : number;
  // email! : string;
  genero! : number;
  especie!: number;
  imagem! : any;
  contato! : Contato;
  edicao: boolean = true;
  user : any;


  constructor(private firebase : FirebaseService,
    private alertController: AlertController,
    private auth : AuthService,
    private router: Router) {
      this.user = this.auth.getUsuarioLogado();
    }

  ngOnInit() {
    this.contato = history.state.contato;
    this.nome = this.contato.nome;
    this.comentario = this.contato.comentario;
    // this.telefone = this.contato.telefone;
    // this.email = this.contato.email;
    this.genero = this.contato.genero;
    this.especie = this.contato.especie;

  }

  habilitar(){
    if(this.edicao){
      this.edicao = false;
    }else{
      this.edicao = true;
    }
  }

  uploadFile(imagem: any){
    this.imagem = imagem.files;
  }

  editar(){
    if(this.nome){
      let novo: Contato = new Contato(this.nome);
      // novo.email = this.email;
      novo.comentario =this.comentario
      novo.genero = this.genero;
      novo.especie = this.especie;
      novo.id = this.contato.id;
      novo.uid = this.user.uid;
      if(this.imagem){
        this.firebase.uploadImage(this.imagem, novo)
        ?.then(()=>{this.router.navigate(["/home"]);})
      }else{
        novo.downloadURL = this.contato.downloadURL;
        this.firebase.editar(novo, this.contato.id)
        .then(()=>{this.router.navigate(["/home"]);})
        .catch((error)=>{
          console.log(error);
          this.presentAlert("Erro", "Erro ao Atualizar Contato!");
        })
      }
    }else{
      this.presentAlert("Erro", "Nome e Telefone são campos Obrigatórios!");
    }
  }

  excluir(){
    this.presentConfirmAlert("ATENÇÃO", "Deseja realmente excluir o contato?");
  }

  //firebase deploy

  excluirContato(){
    this.firebase.excluir(this.contato.id)
    .then(() => { this.router.navigate(["/home"]);})
    .catch((error)=>{
      console.log(error);
      this.presentAlert("Erro", "Erro ao Excluir Contato!");
    })

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

  async presentConfirmAlert(subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: 'Agenda de Contatos',
      subHeader: subHeader,
      message: message,
      buttons: [
        {text: 'Cancelar', role: 'cancelar', handler: ()=>{console.log("cancelou")}},
        {text: 'Confirmar', role: 'confirmar', handler: (acao)=>{this.excluirContato()}}
      ],
    });
    await alert.present();
  }



}
