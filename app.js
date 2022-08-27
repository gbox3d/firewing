import express from 'express'
import dotenv from "dotenv"
import https from 'https'
import http from 'http'
import fs from 'fs'

dotenv.config({ path: '.env' }); //환경 변수에 등록 
console.log(`run mode : ${process.env.NODE_ENV}`);

const app = express()

console.log(process.env.WWW)
app.use('/', express.static(process.env.WWW));

//순서 주의 맨 마지막에 나온다.
app.all('*', (req, res) => {
  res
    .status(404)
    .send('oops! resource not found')
});

let baseServer;
if(process.env.SSL === 'True') {
  console.log(`SSL mode ${process.env.SSL}`);
  const options = {
    key: fs.readFileSync(process.env.SSL_KEY),
    cert: fs.readFileSync(process.env.SSL_CERT),
    ca: fs.readFileSync(process.env.SSL_CA),
  };
  // https 서버를 만들고 실행시킵니다
  baseServer = https.createServer(options, app)

}
else {
  baseServer = http.createServer({}, app)
}

baseServer.listen(process.env.PORT, () => {
  console.log(`server run at : ${process.env.PORT}`)
});


