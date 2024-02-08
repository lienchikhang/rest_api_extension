"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = require("fs");
const router = (0, express_1.Router)();
router.get('/download', (req, res) => {
    (0, fs_1.readdir)('../setupex', (err, files) => {
        if (err) {
            console.log('error', err);
            return;
        }
        files.forEach(file => {
            console.log('file', file);
            //check if there's another folder inside
            const isDirectory = (0, fs_1.statSync)(`../setupex/${file}`).isDirectory();
            if (!isDirectory) {
                const stream = (0, fs_1.createReadStream)(`../setupex/${file}`, { encoding: 'utf-8' });
                // Gửi file dưới dạng luồng
                stream.pipe(res);
            }
        });
    });
    return res.status(200).json({ success: true, message: 'happy download' });
});
module.exports = router;
