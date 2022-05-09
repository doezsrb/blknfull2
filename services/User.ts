import crypto from 'crypto'
import database,{storage} from '../store/db';
import axios, { AxiosResponse } from 'axios';
import { ImageListType, ImageType } from 'react-images-uploading';
import { Socket } from 'socket.io-client';
import { Session } from 'next-auth';


const ALGORITHM = 'aes-256-ctr';
const IV_LENGTH = 16;
const PROTOCOL = process.env.NEXT_PUBLIC_PROTOCOL;
const HOST = process.env.NEXT_PUBLIC_HOST;

type Data = {
    result:string,
    id?:string|number
}

export default class User{
   /* con = mysql.createConnection({
      host:'localhost',
      user:'root',
      password:'',
      database:'balkan_dating'
    });
    */
    
    gender?:string;
    name?:string;
    email?:string;
    password?:any;
  
    constructor(email?:string,password?:any,gender?:string,name?:string){
      this.email = email;
      this.password = password;
      this.name = name;
      this.gender = gender;
    }

    register():Promise<any>{
        return new Promise((resolve,reject) => {
          var encryptPass = this.encrypt(this.password.toString())
          let user = {
              name:this.name,
              password:encryptPass,
              email:this.email,
              gender:this.gender
          }
          var new_row = database.ref('/users/').push();
          new_row.set(user,(err:any) => {
            if(err){
              reject("Error");
            }
              resolve(new_row.key);
            
          })
        })

        /* this.con.query("INSERT INTO users SET ?",user,(err,result) => {
          if(err) throw err;
          res.json({result:'success'})
          this.con.end()
        })*/
    }
    checkRegEmail():Promise<any>{
        return new Promise((resolve,reject) => {
            var ref = database.ref('users');
            ref.orderByChild("email").equalTo(this.email!).once('value',(snap:any) => {
              if(snap.exists()){
                reject('Email exists');
              }else{
                resolve('Ok')
              }
            })
            /*
            this.con.query("SELECT * FROM users WHERE email = ?",[this.email],(err,result) => {
              if (err) throw err;
              if(result.length == 0){
                resolve("Ok")
              }else{
                reject("Email exists")
              }
            })
            */
        })
    }
    getUser(id:string):Promise<any>{
      return new Promise((resolve,reject) => {
        var ref = database.ref(`users/${id}`);
        ref.once('value',(snap:any) => {
          if(snap.exists()){
            let data = snap.val();
            
            resolve(data);
          }else{
            resolve(null);
          }
        })
      });
    }

    updateUser(id:string,data:any):Promise<any>{
      return new Promise(async (resolve,reject) => {
       
        var images = data.imgs == null ? [] : data.imgs;
        var imgs4delete = data.imgs4delete == null ? [] : data.imgs4delete;
        delete data.imgs4delete;
        var uploadedImgs = data.uploadedImgs == null ? [] : data.uploadedImgs;
        delete data.uploadedImgs;

        var fUpload:any = [];
        images.map((img:any) => {
          if(uploadedImgs.filter((e:any) => e.dataURL == img.dataURL).length == 0){
            fUpload.push(img);
          }
        });

        var oldUrls:string[] = [];
        uploadedImgs.map((img:any) => {
          oldUrls.push(img.url);
        });

        if(fUpload.length == 0){
          delete data.imgs
        }
        var profileImg = data.profileImg;
        delete data.profileImg;
            //profile img
            if(profileImg != null && profileImg != ''){
              
              if(profileImg.length != 0){
                //resize img small 40x40
                let resizedSmallImg:any = await this.resizeImage(profileImg[0],[40,40]);
                if(resizedSmallImg != 'Error'){
                  let resizedImgObj = {
                    dataURL: resizedSmallImg.dataURL,
                    type:resizedSmallImg.type
                  }
                  //upload imgs
                  var smallImg:any = await this.uploadImages([resizedImgObj]);
                  if(smallImg.result == "Error"){
                    smallImg = null
                  }
                                 
                }
                //resize imgs medium  155x155

                let resizedMediumImg:any = await this.resizeImage(profileImg[0],[155,155]);
                if(resizedMediumImg != 'Error'){
                  let resizedImgObj = {
                    dataURL: resizedMediumImg.dataURL,
                    type:resizedMediumImg.type
                  }
                  //upload imgs
                  var mediumImg:any = await this.uploadImages([resizedImgObj]);
                  if(mediumImg.result == "Error"){
                    mediumImg = null
                  }              
                }

                let profileImgUrl:any = await this.uploadImages(profileImg);
                    if(profileImgUrl.result != "Error"){
                      data.profileUrl = {
                        small:smallImg.urls[0] == null ? profileImgUrl.urls[0] : smallImg.urls[0],
                        medium:mediumImg.urls[0] == null ? profileImgUrl.urls[0] : mediumImg.urls[0],
                        large:profileImgUrl.urls[0]
                      }
                }
                
              }
            }
           
            //imgs
            if(fUpload.length != 0){
              var urls:string[] = [];
              for(let u of fUpload){
                let res:any = await this.uploadImages([u]);
                if(res.result != "Error"){
                  urls.push(res.urls[0]);
                }
              }
              oldUrls = oldUrls.concat(urls);
              data.imgs = oldUrls;
            }

            //delete imgs
            if(imgs4delete.length != 0){
              for(let u of imgs4delete){
                let result = await this.deleteImages([u]);
                  if(result == 'Success'){
                    let index = oldUrls.indexOf(u);
                    if(index !== -1){
                      oldUrls.splice(index,1);
                    }
                  }
              }
              
              data.imgs = oldUrls;
            }
            
            var ref = database.ref(`users/${id}`);
            ref.update(data).then(()=>{
              resolve({msg:'Success',data:data.imgs});
            })
            .catch(e => {
              reject('Update Error');
            });        
      }); 
    }
    deleteImages(images:any[]){
      return new Promise((resolve,reject) => {
        images.map((img:any) => {
          var image = storage.ref().child(img.url);
          image.delete().then(() => {
            resolve('Success');
          }).catch(e => reject(e));
        });  

      });
    }
    resizeImage(img:any,size:any[]){
      return new Promise((resolve,reject) => {
        axios.post(`${PROTOCOL}://${HOST}/api/resizeimg`,{
          img:img,
          size:size
        }).then((res:AxiosResponse<any>) => {
         
          resolve(res.data);
        }).catch(e => reject(e));
      });
    }
    uploadImages(images:any[]):Promise<any>{
      return new Promise((resolve,reject) => {
        axios.post(`${PROTOCOL}://${HOST}/api/uploadimgs`,{
        imgs:images
        }).then((res:AxiosResponse<any>) => {
          resolve(res.data);
        }).catch(e => reject(e));
      })
    }
    getImages(images:string[]):Promise<string[]>{
      return new Promise(async (resolve,reject) => {
        try{
          var ref = storage.ref();
          var urls = new Array();
          for(let image of images){
            var imgRef = ref.child(image);
            var url = await imgRef.getDownloadURL();
            urls.push(url);
          }
          resolve(urls);
        }catch(e){
          
          reject("Error Fetch");
        }
      })  
    }
    getUsers():Promise<any[]>{
      return new Promise((resolve,reject) => {
        var ref = database.ref(`users`);
        ref.once('value',(snap,err) => {
          if(err) reject(err);
          if(snap.exists()){
            var data = snap.val();
            resolve(data);
          }else{
            resolve([]);
          }
        })
      });
    }
    login():Promise<any>{
      return new Promise((resolve, reject) => {
        
        this.checkEmail().then((result:any) => {
          const encPass = result.data.password;
          const decPass = this.decrypt(encPass);
          const id = result.id;
          const email = result.data.email;
          const name = result.data.name;
          var check_result = this.checkPassword(decPass,id);
          if(check_result.result == "Ok"){
            var user = {
              name:name,
              email:id,
            }
            resolve(user)
          }else{
            reject("Failed login");
          }
        }).catch(e => {
          reject("Failed login");
        
        })
      })
    }
    checkEmail():Promise<any>{
        return new Promise((resolve,reject) => {
          var ref = database.ref('users');
          ref.orderByChild('email').equalTo(this.email!).once('value',(snap:any) => {
            if(snap.exists()){
              let data = Object.values(snap.val());
              let key = Object.keys(snap.val());
              var args = {
                data:data[0],
                id:key[0]
              }
              resolve(args)
            }else{
              reject("Email not exists!");
            }
          })
          /*
          this.con.query("SELECT * FROM users WHERE email = ?",[this.email],(err,result) => {
            if (err) throw err;
            if(result.length != 0){
              resolve(result)
            }else{
              reject("Email not exists!");
            }
          })
          */
        })
    }
    checkPassword(decPass:any,id:any){
        if(decPass == this.password){
            return {result:'Ok',id:id};
        }else{
            return {result:'Error'}; 
        }
    }
     decrypt(text:any) {
      let textParts = text.split(':');
      let iv = Buffer.from(textParts.shift(), 'hex');
      let encryptedText = Buffer.from(textParts.join(':'), 'hex');
      let decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from('FoCKvdLslUuB4y3EZlKate7XGottHski1LmyqJHvUhs=', 'base64'), iv);
      let decrypted = decipher.update(encryptedText);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return decrypted.toString();
    }
     encrypt(text:any) {
        let iv = crypto.randomBytes(IV_LENGTH);
        let cipher = crypto.createCipheriv(ALGORITHM, Buffer.from('FoCKvdLslUuB4y3EZlKate7XGottHski1LmyqJHvUhs=', 'base64'), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    }

    
    checkSocket(session:Session|null,socket:Socket){
        if(session != null){
          socket.emit('addonline',{userid:session?.user?.email});
        }
    }
}