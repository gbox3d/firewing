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

            // console.log(key)
            // if(key === 'query') {
            //     console.log(value)
            // }

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

            if (protocol === 'http') {
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

                if (protocol === 'http') {
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

function forwardRouter_comfile({ hostname, port, protocol }) {

    const router = express.Router()
    //cors 정책 설정 미들웨어 
    router.use(cors());

    function _pipe(res, orgRes) {

        let dataChunks = []

        for (const [key, value] of Object.entries(orgRes.headers)) {

            // console.log(key)
            // if(key === 'query') {
            //     console.log(value)
            // }

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

            if (protocol === 'http') {
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

                //add repo ip 
                const params = {
                    repo_ip: `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}`,
                }
                let _query = Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&');
                req.headers['query'] = `${req.headers['query']}&${_query}`

                // for(const [key, value] of Object.entries(req.headers)) {

                //     //call upload api
                //     if(key === 'query') {

                //         const params = {
                //             repo_ip : `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}`,
                //         }

                //         let _query = Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&');
                //         req.headers[key] = `${req.headers[key]}&${_query}`

                //         console.log(`insert repo ip : ${req.headers[key]}`)
                //     }
                // }

                const options = {
                    hostname: hostname,
                    port: port,
                    method: 'POST',
                    path: req.baseUrl,
                    headers: req.headers
                };

                if (protocol === 'http') {
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


export { forwardRouter, forwardRouter_comfile }