import { Request, Response, Router } from 'express';
import { createReadStream, readdir, statSync, mkdir} from 'fs';
import path from 'path';
const router = Router();

router.get('/download', (req: Request, res: Response) => {
    const folderPath = path.join('src', 'setupex');
    readdir(folderPath, (err: NodeJS.ErrnoException | null, files: string[]) => {
        if(err) {
            console.log('error', err);
            return;
        }

        files.forEach(file => {
           console.log('file', file);
           const filePath = path.join(folderPath, file);
           console.log('path file', filePath)

           //check if there's another folder inside
           const isDirectory = statSync(filePath).isDirectory();
           
           if (!isDirectory) {
                const stream = createReadStream(filePath, {encoding: 'utf-8'});
            
                res.setHeader('Content-disposition', 'attachment; filename=' + file);
            // Gửi file dưới dạng luồng
            stream.pipe(res);
           } else {
                readdir(filePath, (err: NodeJS.ErrnoException | null, files: string[]) => {
                    files.forEach(file => {
                        console.log('file', file);
                        const childrenPath = path.join(filePath, file);
             
                        //check if there's another folder inside
                        const stream = createReadStream(childrenPath, {encoding: 'utf-8'});
                         
                            res.setHeader('Content-disposition', 'attachment; filename=' + file);
                         // Gửi file dưới dạng luồng
                         stream.pipe(res);
                })
            })
           }
        })

        })

    })

module.exports = router;