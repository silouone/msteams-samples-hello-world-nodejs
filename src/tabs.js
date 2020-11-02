const  send = require('send');
const jwt = require("jsonwebtoken");
const {getKey} = require("./utils/OpenIdMetadata");
const request = require("request");

 function tabs(server) {
    // Setup home page
    server.get('/', (req, res, next) => {
        send(req, 'src/views/hello.html').pipe(res);
    });

    // Setup the static tab
    server.get('/hello', (req, res, next) => {
        send(req, 'src/views/hello.html').pipe(res);
    });

    server.get('/configure', (req, res, next) => {
        send(req, 'src/views/configure.html').pipe(res);
    });


    server.get('/auth',  (req, res, next) => {
        send(req, 'src/views/auth.html').pipe(res);
    });

    server.get('/auth-end',  (req, res, next) => {
    console.log('TCL ------> : tabs -> req', req)
    console.log('TCL ------> : tabs -> req', req.body)
    console.log('TCL ------> : tabs -> req', req.header("authorization"))
    let authHeaderMatch = /^Bearer (.*)/i.exec(req.header("authorization"));
    console.log('TCL ------> : tabs -> authHeaderMatch', authHeaderMatch)

        send(req, 'src/views/auth-end.html').pipe(res);
    });

    server.get('/first', (req, res, next) => {
        send(req, 'src/views/first.html').pipe(res);
    });

    server.get('/.well-known/microsoft-identity-association.json', (req, res, next) => {
        res.setHeader('Content-Type', 'application/json')
        send(req, 'src/views/.well-known/microsoft-identity-association.json').pipe(res);
    });



    server.get('/validate-token', (req, res, next) => {
        // let msaOpenIdMetadata = new OpenIdMetadata("https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration");
    //     let result = request({
    //                     method: "GET",
    //                     // url: 'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration',
    //                     url: 'https://login.microsoftonline.com/f434e854-1d08-43e3-8706-b662d09e1bc9/v2.0'
    //                 });
    //     console.log('TCL ------> : tabs -> result', result)

    // console.log('TCL ------> : tabs -> req', req)
    // console.log('TCL ------> : tabs -> req', req)
            let authHeaderMatch = /^Bearer (.*)/i.exec(req.header("authorization"));
            console.log('TCL ------> : tabs  HERE -> authHeaderMatch', authHeaderMatch)
            if (!authHeaderMatch) {
                                console.error("No Authorization token provided");
                                res.send(401);
                                return;
            }

            
        const encodedToken = authHeaderMatch[1];
        const decodedToken = jwt.decode(encodedToken, { complete: true });
        console.log('TCL ------> : tabs -> decodedToken', decodedToken)
        // getKey(decodedToken["header"].kid, (key) => {
        //     if (!key) {
        //         console.error("Invalid signing key or OpenId metadata document");
        //         res.send(500);
        //     }
        // const verifyOptions =  {
        //     algorithms: ["RS256", "RS384", "RS512"],
        //     issuer: `https://sts.windows.net/${decodedToken["payload"].tid}/`,
        //     audience: "8de3e1f3-6e43-4454-b559-f8ce91760e82",
        //     clockTolerance: 300,
        // };
        // const required = {
        //     "typ": "JWT",
        //     "alg": "RS256",
        //     "x5t": "iBjL1Rcqzhiy4fpxIxdZqohM2Yk",
        //     "kid": "iBjL1Rcqzhiy4fpxIxdZqohM2Yk"
        //   }
        // console.log('TCL ------> : tabs -> decodedToken', decodedToken)
        // try {
        //     let token = jwt.verify(encodedToken,'jibNbkFSSbmxPYrN9CFqRk4K4gw' , verifyOptions);
        //     console.log('TCL ------> : tabs -> token', token)
        //     res.send(token);
        // } catch (e) {
        //     console.log('TCL ------> : tabs -> e', e)
        //     console.error("Invalid bearer token", e);
        //     res.send(401);
        // }
    });

 }

exports.tabs = tabs;