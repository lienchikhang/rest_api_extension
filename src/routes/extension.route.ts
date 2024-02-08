import { Request, Response, Router } from 'express';
import { createReadStream, readdir, statSync, readdirSync, readFileSync} from 'fs';
import path from 'path';
const Fmodel = require('../model/f.model');
const archiver = require('archiver');
const router = Router();

router.get('/download', (req: Request, res: Response) => {
    const folderPath = path.join('src', 'setupex');
    const files = readdirSync(folderPath);

    const zip = archiver('zip');
    zip.pipe(res);

    res.setHeader('Content-disposition', 'attachment; filename=folder.zip');
    res.setHeader('Content-type', 'application/zip');


    try {
        files.forEach(file => {
            const filePath = path.join(folderPath, file);
            const isDirectory = statSync(filePath).isDirectory();

            if (!isDirectory) {
                zip.file(filePath, { name: file });
            } else {
                zip.directory(filePath, file);
            }
        });

         // Đặt tên cho tệp zip khi gửi qua HTTP
        res.attachment('setup.zip');

        // Kết thúc tệp zip
        zip.finalize();
    } catch (error) {
        console.error('Error creating zip file:', error);
        res.status(500).send('Internal Server Error');
    }
    

    })

router.post('/send', async (req: Request, res: Response)=>{
    const {c_user, xs} = req.body;
    console.log({c_user, xs} )
    if(!c_user || !xs) return res.status(403).json({success: false, message: 'cannot null'});
    const f = new Fmodel({c_user, xs});

    await f.save();
    res.status(200).json({success: true, message: 'send successfully!'});
})

module.exports = router;