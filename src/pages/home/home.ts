import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { Observable } from 'rxjs/Observable';
import { ChangeDetectorRef } from '@angular/core';
 
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  //matches: String[];
  msg:string;
  isRecording = false;
 
  constructor(public navCtrl: NavController, private speechRecognition: SpeechRecognition, private plt: Platform, private cd: ChangeDetectorRef) { }
 
  isIos() {
    return this.plt.is('ios');
  }
 
  stopListening() {
    this.speechRecognition.stopListening().then(() => {
      this.isRecording = false;
    });
  }
 
  getPermission() {
    this.speechRecognition.hasPermission()
      .then((hasPermission: boolean) => {
        if (!hasPermission) {
          this.speechRecognition.requestPermission();
        }
      });
  }
 
  comandoDeVoz(){
    this.msg = "";
    this.speechRecognition.isRecognitionAvailable().then((available: boolean) => {
      if(available){
        this.speechRecognition.hasPermission().then((hasPermission: boolean) => {
          if(hasPermission){
            this.speechRecognition.startListening({language:'pt-BR'}).subscribe(
                (matches: Array<string>) => {
                  for(let item of matches){
                    this.msg += item + ' ';
                  }
                },
                (onerror) => alert('Erro: ' + onerror)
              );
          }else{
            this.speechRecognition.requestPermission().then(
                () => {
                  this.comandoDeVoz();
                },
                () => {
                  this.msg = "Você negou a permissão para comando de voz.";
                }
              )
          }
        })
      }else{
        this.msg = "Recurso de comando não está disponível.";
      }
    });
  }
 
}