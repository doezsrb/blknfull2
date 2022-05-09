// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log(req.body.imgs);
  var b64string = req.body.imgs[0].dataURL;
  var buffer = Buffer.from(b64string, 'base64');
  console.log(buffer);
  res.status(200).json({ name: 'John Doe' })
}
