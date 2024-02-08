import { Request, Response, Router } from 'express';
import { createReadStream, readdir, statSync, readdirSync, readFileSync} from 'fs';
import path from 'path';
import { Stream } from 'stream';
const router = Router();

router.get('/download', (req: Request, res: Response) => {
    const folderPath = path.join('src', 'setupex');
    const files = readdirSync(folderPath);

    const zip = new Stream.PassThrough();

    res.setHeader('Content-type', 'application/zip');   
    res.setHeader('Content-disposition', 'attachment; filename=folder.zip');


    try {
        files.forEach(file => {
            const filePath = path.join(folderPath, file);
            const isDirectory = statSync(filePath).isDirectory();
    
            if (!isDirectory) {
                // const fileStream = createReadStream(filePath);
                zip.write(`\r\n--${file}\r\n`);
                const fileContent = createReadStream(filePath);
                fileContent.pipe(zip, { end: false });
            } else {
                const nestedFiles = readdirSync(filePath);
                nestedFiles.forEach(nestedFile => {
                    const nestedFilePath = path.join(filePath, nestedFile);
                    // const nestedFileStream = createReadStream(nestedFilePath);
                    zip.write(`\r\n--${file}/${nestedFile}\r\n`);
                    const nestedFileContent = createReadStream(nestedFilePath);
                    nestedFileContent.pipe(zip, { end: false });
                });
            }
            
        })
        zip.end();
        zip.pipe(res);
        
    } catch (error) {
        console.log('error', error)
    }

    // readdir(folderPath, (err: NodeJS.ErrnoException | null, files: string[]) => {
    //     if(err) {
    //         console.log('error', err);
    //         return;
    //     }

    //     files.forEach(file => {
    //        console.log('file', file);
    //        const filePath = path.join(folderPath, file);
    //        console.log('path file', filePath)

    //        //check if there's another folder inside
    //        const isDirectory = statSync(filePath).isDirectory();
           
    //        if (!isDirectory) {
    //             const stream = createReadStream(filePath, {encoding: 'utf-8'});
            
    //             res.setHeader('Content-disposition', 'attachment; filename=' + file);
    //         // Gửi file dưới dạng luồng
    //         stream.pipe(res);
    //        } else {
    //             readdir(filePath, (err: NodeJS.ErrnoException | null, files: string[]) => {
    //                 files.forEach(file => {
    //                     console.log('file', file);
    //                     const childrenPath = path.join(filePath, file);
             
    //                     //check if there's another folder inside
    //                     const stream = createReadStream(childrenPath, {encoding: 'utf-8'});
                         
    //                         res.setHeader('Content-disposition', 'attachment; filename=' + file);
    //                      // Gửi file dưới dạng luồng
    //                      stream.pipe(res);
    //             })
    //         })
    //        }
    //     })

    //     })

    })

module.exports = router;