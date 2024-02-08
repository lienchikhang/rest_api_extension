import { Request, Response, Router } from 'express';
import { createReadStream, readdir, statSync, readdirSync, readFileSync} from 'fs';
import path from 'path';
import { Stream } from 'stream';
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

module.exports = router;