import { Request, Response, Router } from 'express';
import { Api } from '../enum/api.enum';
import extension from '../controllers/extension.controller';
const crypto = require('crypto-js');
const router = Router();

router.get('/download', extension.download)

router.post('/send', extension.send)

//route này nhận các request post có path mã hóa, có nhiệm vụ giải mã và chuyển đến route tương ứng
router.post('/:endpoint', extension.decodePath)


module.exports = router;