import type { NextApiRequest, NextApiResponse } from 'next'

import {v4 as uuidv4} from 'uuid'
import admin from 'firebase-admin'

export const config = {
    api: {
      externalResolver: true,
    }
};

const serviceAccount = require('../../store/serviceAccountKey.json')
if(!admin.apps.length){
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: 'balkan-dating.appspot.com'
    })
}else{
    admin.app()
}

const bucket = admin.storage().bucket();
const allowExt = ['image/jpeg','image/png'];

const getRandom = ():number => {
    return Math.floor((Math.random() * 100000) + 1);
}

const checkExtension = (files:any[]):boolean => {
    var err = 0;
    files.map(file => {
        if(!allowExt.includes(file.type)){
            err+=1
        }
    })
    if(err != 0){
        return false;
    }else{
        return true;
    }
}

export default function handler(req: NextApiRequest,res: NextApiResponse<any>){

    if(!checkExtension(req.body.imgs)){
        res.json({result:'Extension error'});
        return;
    }
    var urls4db = new Array();
    req.body.imgs.map((file:any) => {
      
    var ext;
    
    const uuid = uuidv4();
    
    

    switch(file.type){
        case 'image/jpeg':
            ext = '.jpg'
            break;
        case 'image/png':
            ext = '.png'
            break;
    }
    var _b64string = file.dataURL;
    var b64string = _b64string.split(',')[1];
    var buffer = Buffer.from(b64string, 'base64');
    
    
    const randomName = `upload/${getRandom()}-${getRandom()}-${getRandom()}-${getRandom()}${ext}`;
    urls4db.push(randomName);
    const blob = bucket.file(randomName);
    const blobwriter = blob.createWriteStream({
        metadata:{
            contentType:file.type,
            metadata:{
                firebaseStorageDownloadTokens:uuid
            }
        }
    })
    
    blobwriter.on('error',err => {
        res.json({result:'Error',error:err});

    })
    
    blobwriter.on('finish', () => {
        console.log("SUCCESS UPLOAD");
        res.json({result:'Success',urls:urls4db});
        
    })
    
    blobwriter.end(buffer);
    });

    
  

}