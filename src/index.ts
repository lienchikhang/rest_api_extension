const express = require('express');
const cors = require('cors');
const extensionRouter = require('./routes/extension.route');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
require('dotenv').config();
app.use(express.json());

app.use('/extension', extensionRouter);


mongoose.connect(process.env.CONNECT_MONGOO)
.then((res: void) => console.log('connected mongodb'))
.catch((err: void) => console.log(err))

app.listen(5000, () => {
    console.log('listening on port ' + 3000);
})