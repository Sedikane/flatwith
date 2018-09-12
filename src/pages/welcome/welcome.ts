import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup ,FormBuilder,Validators} from '@angular/forms';

/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var provider = new firebase.auth.GoogleAuthProvider();
var provider = new firebase.auth.FacebookAuthProvider();
declare var firebase;
@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {
  welcome: FormGroup;

  display = 0;
  signup:boolean=false;
  logins:boolean=false;
  
  fname;
  lname;
  email;
  password;
  contactNo;
  human={
    fname:"",
    lname:"",
    contactNo:"",
    password:""
  }
     loginError: string;
  constructor(public navCtrl: NavController, public navParams: NavParams ,private fb:FormBuilder) {
    this.welcome=this.fb.group({
      email:['',[Validators.required,Validators.pattern('[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})'),Validators.maxLength(25)]],
      password:['',[Validators.required,Validators.minLength(6)]],
      fname:['',[Validators.required,Validators.pattern('[a-zA-Z]*'),Validators.maxLength(20)]],
      lname:['',[Validators.required,Validators.pattern('[a-zA-Z]*'),Validators.maxLength(20)]],
      contactNo:['',[Validators.required,Validators.maxLength(10)]],
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
  }

  
  login(){
    firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(User =>{
      this.navCtrl.push("ViewPage");
    })
  }

  submit(){
    this.display = 1;
  }
  signups(){
    firebase.auth().createUserWithEmailAndPassword(this.email,this.password).then(user => {
    this.display = 1;
    })
  }
  
loginWithGoogle(){
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).then(User =>{
    this.navCtrl.push("ViewPage");
  })
}
loginWithFacebook(){
  var provider = new firebase.auth.FacebookAuthProvider();
  firebase.auth().signInWithPopup(provider).then(User =>{
    this.navCtrl.push("ViewPage");
  })
}
}
