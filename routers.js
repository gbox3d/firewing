import express from 'express'
import cors from 'cors'

import http from 'http'
import https from 'https'


function forwardRouter({ hostname, port, protocol }) {

    const router = express.Router()
    //cors 정책 설정 미들웨어 
    router.use(cors());

    function _pipe(res, orgRes) {
        
        let dataChunks = []

        for (const [key, value] of Object.entries(orgRes.headers)) {
            
            res.setHeader(key, value)
        }
        
        orgRes.on('data', function (chunk) {
            dataChunks.push(chunk)
        });
        
        orgRes.on('end', function () {
            res.send(Buffer.concat(dataChunks))
        });

    }

    router.route('/')
        .get((req, res) => {

            // console.log(req)

            console.log(`forwardRouter ${protocol}://${hostname}:${port}${req.originalUrl}`)

            const options = {
                hostname: hostname,
                port: port,
                headers: req.headers,
                method: 'GET',
                path: req.originalUrl
            };

            if(protocol === 'http') {
                const orgReq = http.request(options, orgRes => {
                    _pipe(res, orgRes)
                }).on('error', (err) => {
                    console.log(err)
                    res.status(500).send(e.message);
                }).end()
            }
            else {
                const orgReq = https.request(options, orgRes => {
                    _pipe(res, orgRes)
                }).on('error', (err) => {
                    console.log(err)
                    res.status(500).send(e.message);
                }).end()
            }

            // const _req = http.request(options, function (_res) {

            //     _pipe(res, _res)

            //     // // let body_data = '';
            //     // let dataChunks = []

            //     // for (const [key, value] of Object.entries(_res.headers)) {
            //     //     // console.log(key, value);
            //     //     res.setHeader(key, value)
            //     // }
            //     // // let _recvSize = 0;
            //     // _res.on('data', function (chunk) {
            //     //     // console.log(`recv ${chunk.length} bytes`);
            //     //     // _recvSize += chunk.length;
            //     //     dataChunks.push(chunk)
            //     //     // body_data +=  chunk;
            //     // });

            //     // //응답을 모두 받고나서 처리해줘야하는것들...
            //     // _res.on('end', function () {
            //     //     // console.log(`recv ${_recvSize} bytes`);
            //     //     res.send(Buffer.concat(dataChunks))
            //     // });
            // });

            // _req.on('error', function (e) {
            //     console.log('problem with request: ' + e.message);
            //     res.status(500).send(e.message);
            // });

            // _req.end();

            // res.json({ r: 'ok', info: `mongo db auth system` })
        })
        .post(async (req, res) => {

            try {

                let body_buf = await new Promise((resolve, reject) => {
                    let dataChunks = []
                    req.on('data', (data) => {
                        // _index += data.length
                        dataChunks.push(data) //버퍼에 추가 
                    });
                    req.on('end', () => {
                        resolve(Buffer.concat(dataChunks))
                    });
                });

                const options = {
                    hostname: hostname,
                    port: port,
                    method: 'POST',
                    path: req.baseUrl,
                    headers: req.headers
                };

                if(protocol === 'http') {
                    const orgReq = http.request(options, orgRes => {
                        _pipe(res, orgRes)
                    }).on('error', (err) => {
                        console.log(err)
                        res.status(500).send(e.message);
                    })
                    orgReq.write(body_buf)
                    orgReq.end()
                }
                else {
                    const orgReq = https.request(options, orgRes => {
                        _pipe(res, orgRes)
                    }).on('error', (err) => {
                        console.log(err)
                        res.status(500).send(e.message);
                    })
                    orgReq.write(body_buf)
                    orgReq.end()
                }
            }
            catch (e) {
                console.log(e)

            }

        });

    return router
}

export { forwardRouter }