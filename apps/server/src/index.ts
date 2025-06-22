import express from 'express';
import http from 'http';
import path from 'path';
import dotenv from 'dotenv';
import router from './router';
import cors from 'cors';
dotenv.config({
    path: path.resolve(__dirname, '../.env'),
});

const PORT = process.env.PORT;
console.log(PORT);
const app = express();
app.use(cors({
    origin: '*'
}))
const server = http.createServer(app);

app.use(express.json());

app.use('/api', router);


server.listen(PORT, () => {
    console.log(`server is listening at port ${PORT}`);
})
