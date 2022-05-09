import sharp from 'sharp';
import type { NextApiRequest, NextApiResponse } from 'next'
export const config = {
    api: {
        externalResolver: true
    }
}
export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ) {
 
    var base64 = req.body.img.dataURL;
    var size = req.body.size;
    let parts = base64.split(';');
    let mimType = parts[0].split(':')[1];
    let imageData = parts[1].split(',')[1];
    var img = Buffer.from(imageData,'base64');
    sharp(img).resize(size[0],size[1])
    .toBuffer()
    .then(resizedImg => {
        let resizedImageData = resizedImg.toString('base64');
        let resizedBase64 = `data:${mimType};base64,${resizedImageData}`;
        let obj = {
            dataURL:resizedBase64,
            type:mimType
        }
        res.send(obj);
    }).catch(e => {
        console.log(e);
        res.send("Error");
    });
  }
  