import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform  } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from '@ionic-native/media-capture';
import firebase from 'firebase';
/**
 * Generated class for the ViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var config = {
  apiKey: "AIzaSyB23MABkHU79cm1eWn9hXkbdjpb5GMACRg",
  authDomain: "flatfinder-348c2.firebaseapp.com",
  databaseURL: "https://flatfinder-348c2.firebaseio.com",
  projectId: "flatfinder-348c2",
  storageBucket: "flatfinder-348c2.appspot.com",
  messagingSenderId: "746676258391"
};
// declare var firebase;
@IonicPage()
@Component({
  selector: 'page-view',
  templateUrl: 'view.html',
})
export class ViewPage {
  hasIt = 0;
  imageURI;
  stringPic;
  upload;
  uploadFile = {
    name: '',
    downloadUrl: ''
  }
  fire = {
    downloadUrl: ''
  }
  firebaseUploads;
 
  constructor(public navCtrl: NavController, public navParams: NavParams,private mediaCapture: MediaCapture, private platform: Platform, private f: File) {
    firebase.initializeApp(config);
    this.upload = firebase.database().ref('/upload/');
    this.firebaseUploads = firebase.database().ref('/fireuploads/');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewPage');
  }
  logoutUser(){
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signOut().then(User =>{
      this.navCtrl.push("HomePage");
    });
  }

  uploads(type) {
    this.platform.ready().then(() => {
      let promise
      switch (type) {
        case 'camera':
          promise = this.mediaCapture.captureImage()
          break
      }
    
      promise.then((mediaFile: MediaFile[]) => {
        console.log(mediaFile)

        //this.presentLoading
        this.imageURI = mediaFile[0].fullPath
        var name = this.imageURI.substring(this.imageURI.lastIndexOf('/') + 1, this.imageURI.length);
        console.log(name);

        switch (type) {
          case 'camera':
            this.stringPic = this.imageURI;
            this.uploadFile.name = "Camera Image"
            this.uploadFile.downloadUrl = this.stringPic;
            this.upload.push({ name: "Camera Image", downloadUrl: this.stringPic });
            break
        }
        var directory: string = this.imageURI.substring(0, this.imageURI.lastIndexOf('/') + 1);
        directory = directory.split('%20').join(' ')
        name = name.split('%20').join(' ')
        console.log(directory)
        console.log('About to read buffer')
        let seperatedName = name.split('.')
        let extension = ''
        if (seperatedName.length > 1) {
          extension = '.' + seperatedName[1]
        }
        return this.f.readAsArrayBuffer(directory, name).then((buffer: ArrayBuffer) => {
          console.log(buffer)
          console.log('Uploading file')
          var blob = new Blob([buffer], { type: mediaFile[0].type });
          console.log(blob.size);
          console.log(blob)
          const storageRef = firebase.storage().ref('files/' + new Date().getTime() + extension);
          return storageRef.put(blob).then((snapshot: any) => {
            console.log('Upload completed')
            //this.loader.dismiss;
            console.log(snapshot.Q)
            let files = [];
            storageRef.getDownloadURL().then((url) => {
              this.fire.downloadUrl = url;
              this.firebaseUploads.push({ downloadUrl: url });
              return this.fire.downloadUrl;
            });
            console.log(this.firebaseUploads);


          })

        }).catch(err => {
          console.log(err)
        })
      }).catch(err => {
        console.log(err)
      })
    })
  }
  navigate(obj) {
    if (obj === "u") {
      this.hasIt = 1;
    } else if (obj === "v") {
      this.hasIt = 2;
    } else if (obj === "b") {
      this.hasIt = 0;
      this.moo = -9
    }
  }

  moo = 0;
  viewUploads(cow) {
    if (cow === "p") {
      this.moo = 1;
      this.retriveImages();
      console.log("fghfg");
      this.hasIt = -99;
    
    }
  }

  b;
  imageUrl;
  count = 0;
  images = [];

  retriveImages() {
    firebase.database().ref('/fireuploads/').on("value", (snapshot) => {
      snapshot.forEach((snap) => {
        this.b = { keyname: snap.key, name: snap.val().downloadUrl };
        this.imageUrl = this.b.name;
        if (this.imageUrl.indexOf('.jpg') >= 0) {
          this.images.push(this.imageUrl);
        }
        console.log("++++++++++++++images++++++++++++++" + this.imageUrl);
        return false;
      })
    });
  }
}

