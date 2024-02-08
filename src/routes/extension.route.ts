import { Request, Response, Router } from 'express';
import { createReadStream, readdir, statSync} from 'fs';
const router = Router();

router.get('/download', (req: Request, res: Response) => {
    readdir('../setupex', (err: NodeJS.ErrnoException | null, files: string[]) => {
        if(err) {
            console.log('error', err);
            return;
        }

        files.forEach(file => {
           console.log('file', file);

           //check if there's another folder inside
           const isDirectory = statSync(`../setupex/${file}`).isDirectory();
           
           if (!isDirectory) {
                const stream = createReadStream(`../setupex/${file}`, {encoding: 'utf-8'});
            
            // Gửi file dưới dạng luồng
            stream.pipe(res);
           }
        })

        })

        return res.status(200).json({ success: true, message: 'happy download' })
    })

module.exports = router;