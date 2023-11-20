export class Contato{
 private _id!: string;
 private _nome: string;
//  private _telefone: number;
//  private _email!: string;
 private _genero!: number;
 private _downloadURL : any;
 private _uid! : string;
 private _especie!: number;
  email: string | undefined;
  // email: string;

 constructor(nome : string){
  this._nome = nome;
  // this._telefone = telefone;
 }

 public get id(): string {
  return this._id;
}
public set id(value: string) {
  this._id = value;
}


 public get nome() : string{
  return this._nome;
 }

 public set nome(nome: string){
  this._nome = nome;
 }

 public get comentario() : string{
  return this._nome;
 }

 public set comentario(nome: string){
  this._nome = nome;
 }

//  public get telefone() : number{
//   return this._telefone;
//  }

//  public set telefone(telefone: number){
//   this._telefone = telefone;
//  }

//  public get email(): string {
//   return this._email;
// }
// public set email(value: string) {
//   this._email = value;
// }

public get genero(): number {
  return this._genero;
}
public set genero(value: number) {
  this._genero = value;
}

public get especie() : number{
  return this._especie;
 }

 public set especie(especie: number){
  this._especie = especie;
 }


public get downloadURL() : any{
  return this._downloadURL;
}

public set downloadURL(value: any){
  this._downloadURL = value;
}

public get uid(): string {
  return this._uid;
}
public set uid(value: string) {
  this._uid = value;
}


}
