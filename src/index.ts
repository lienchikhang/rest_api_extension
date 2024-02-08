const express = require('express');
const cors = require('cors');
const extensionRouter = require('./routes/extension.route')

const app = express();

app.use(cors());

app.use('/extension', extensionRouter);

app.listen(5000, () => {
    console.log('listening on port ' + 3000);
})