
const jwt = require("jsonwebtoken");
const fetch = require('node-fetch');
const {get, pipe, head, trim, filter} = require('lodash/fp')

// current personal tenant id 
// obtainable from User context or JWT itself
const tid = 'f434e854-1d08-43e3-8706-b662d09e1bc9';
const APP_ID = '8de3e1f3-6e43-4454-b559-f8ce91760e82';


// JWT FIXTURES 

// this is actually an ID_TOKEN
const validEncodedJWT = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImppYk5ia0ZTU2JteFBZck45Q0ZxUms0SzRndyIsImtpZCI6ImppYk5ia0ZTU2JteFBZck45Q0ZxUms0SzRndyJ9.eyJhdWQiOiI4ZGUzZTFmMy02ZTQzLTQ0NTQtYjU1OS1mOGNlOTE3NjBlODIiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9mNDM0ZTg1NC0xZDA4LTQzZTMtODcwNi1iNjYyZDA5ZTFiYzkvIiwiaWF0IjoxNjAwNjQ1NTIxLCJuYmYiOjE2MDA2NDU1MjEsImV4cCI6MTYwMDY0OTQyMSwiYWlvIjoiQVNRQTIvOFFBQUFBQ3BpNGJHaDNxUTViMUpMSCt0dGNTNmpFeXlBdzdMV2FFTnl2ZjZIZXZjTT0iLCJhbXIiOlsicHdkIl0sImF0X2hhc2giOiJFNkxFaERSRlpVTENkT2VVYUlfYVhRIiwiZmFtaWx5X25hbWUiOiJHYWxpbm91IiwiZ2l2ZW5fbmFtZSI6IlNpbG91YW5lIiwiaXBhZGRyIjoiOTEuMTc1LjExNC45MyIsIm5hbWUiOiJTaWxvdWFuZSBHYWxpbm91Iiwibm9uY2UiOiI2Nzg5MTAiLCJvaWQiOiI1NTkzOTBmYi0yOTUxLTRjNTktOGY4OC1hYjlkZDdlM2MzNzgiLCJyaCI6IjAuQUFBQVZPZzA5QWdkNDBPSEJyWmkwSjRieWZQaDQ0MURibFJFdFZuNHpwRjJEb0lRQUlRLiIsInN1YiI6Ii1ra0pyT0NzaF81bHZpS09HQUFMcVJrSFpKaXYxdTNuWkhLdks2WF9nakEiLCJ0aWQiOiJmNDM0ZTg1NC0xZDA4LTQzZTMtODcwNi1iNjYyZDA5ZTFiYzkiLCJ1bmlxdWVfbmFtZSI6InNpbG91YW5lLmdhbGlub3VAY29vcnBhY2FkZW15Lm9ubWljcm9zb2Z0LmNvbSIsInVwbiI6InNpbG91YW5lLmdhbGlub3VAY29vcnBhY2FkZW15Lm9ubWljcm9zb2Z0LmNvbSIsInV0aSI6ImU1d21ONFluYVU2MlRaLVRmSHNnQUEiLCJ2ZXIiOiIxLjAifQ.a7Hwcfv8t8_gmABLNzjPPcm96bQq00-5RgLXsbl7pQBdCrVli6sfUf8kjTbJWhrPcLmdQdAdNnZTzAKB93i_fzpKTgwhrr2s3h9CDJKuhAg4GuEZ5WBdp4yWIXg5c6WmKxG9_q7weMcCT2nEYpL7QwIFAHLRSiFju_pmrCxTigzNOsw-GOxBNBEpmT1O6hFlGn2i2J9J7wFlknuTPx5bvggqkLLqZZI5uD4WOkFLq2-PAo9FKvXsOwa953LJm66kBOKZmGDicDaeDfSVXVwlqcJthclhcJV1J2pZ64H4av6JD9Rvt64UOVBIurq8RQxloFrAoRcQdDOS95iN7EhXsw';


// this is an jw_token , with nonce, not verifyable
const badEncodedJWT = 'eyJ0eXAiOiJKV1QiLCJub25jZSI6ImpMY2R0a2VUTUZXRGJ6dTFiT2lTakUzQ3NfMzNRVXJZa2s5VVRiQ2J1UlkiLCJhbGciOiJSUzI1NiIsIng1dCI6ImppYk5ia0ZTU2JteFBZck45Q0ZxUms0SzRndyIsImtpZCI6ImppYk5ia0ZTU2JteFBZck45Q0ZxUms0SzRndyJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9mNDM0ZTg1NC0xZDA4LTQzZTMtODcwNi1iNjYyZDA5ZTFiYzkvIiwiaWF0IjoxNjAwNjQ3NTYxLCJuYmYiOjE2MDA2NDc1NjEsImV4cCI6MTYwMDY1MTQ2MSwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkUyQmdZSGg4Tk5TTjRVb09hOGduU1U2cFRkR1BvN3Z1YlArMzlXNjBsVWE4czVuaTNWc0EiLCJhbXIiOlsicHdkIl0sImFwcF9kaXNwbGF5bmFtZSI6InRlc3QiLCJhcHBpZCI6IjhkZTNlMWYzLTZlNDMtNDQ1NC1iNTU5LWY4Y2U5MTc2MGU4MiIsImFwcGlkYWNyIjoiMCIsImZhbWlseV9uYW1lIjoiR2FsaW5vdSIsImdpdmVuX25hbWUiOiJTaWxvdWFuZSIsImhhc3dpZHMiOiJ0cnVlIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiOTEuMTc1LjExNC45MyIsIm5hbWUiOiJTaWxvdWFuZSBHYWxpbm91Iiwib2lkIjoiNTU5MzkwZmItMjk1MS00YzU5LThmODgtYWI5ZGQ3ZTNjMzc4IiwicGxhdGYiOiI1IiwicHVpZCI6IjEwMDMyMDAwRTFEQTIzODYiLCJyaCI6IjAuQUFBQVZPZzA5QWdkNDBPSEJyWmkwSjRieWZQaDQ0MURibFJFdFZuNHpwRjJEb0lRQUlRLiIsInNjcCI6IlVzZXIuUmVhZCIsInNpZ25pbl9zdGF0ZSI6WyJrbXNpIl0sInN1YiI6IlJ6dmFfcU1ua2RxVTBEZmxOYVdOdDFLanNJMVp6UUFxWlg4NkFjUFpxd2ciLCJ0ZW5hbnRfcmVnaW9uX3Njb3BlIjoiRVUiLCJ0aWQiOiJmNDM0ZTg1NC0xZDA4LTQzZTMtODcwNi1iNjYyZDA5ZTFiYzkiLCJ1bmlxdWVfbmFtZSI6InNpbG91YW5lLmdhbGlub3VAY29vcnBhY2FkZW15Lm9ubWljcm9zb2Z0LmNvbSIsInVwbiI6InNpbG91YW5lLmdhbGlub3VAY29vcnBhY2FkZW15Lm9ubWljcm9zb2Z0LmNvbSIsInV0aSI6Im9sNjhWeG45dkVLTGo1b2JxVzhqQUEiLCJ2ZXIiOiIxLjAiLCJ4bXNfdGNkdCI6MTQ0NTUwMzQ4OH0.FfO-Hwl1QflGVS_g0rHRSggfBO8oq-VneTEIIGoZbvrtk76FHt0C899E38COPP4_b-1ErMEUuYLOcPeZcubaWUGYVfAdi0LYRSx7E8MafnY2b94L4RLZIOrS3XhyYmhrloD-aXsAgM0uNoQWIEzU0DLk0OAY72LjLklTsSMz5I-wYHHBUcio-JsCDdYGXPwRzU4fnUeiBeq9o42e0PrhaEPX86b433AYBp5fvl_wS-OqPLtXc4D5MWHuqaTYrVkEybDPMu-NA-Y2E36GWm2LBkHy-tgEp2DtGztYqmjqCTqsdy_VCLIilsKrJNEyK73UDGuCS2O20sAUcu2tZnhsLg';



// 1. Make a request to microsoft login URL to get JWKs

const handleResponse = async response => {
    if (!response.ok) {
        throw new Error(response);
    }

    try {
        return await response.json()
    } catch (err) {
        throw new Error(response);
    }
};

const fetchJWKs = async (url) => {
    const response = await fetch(url, {});
    return handleResponse(response)
}

// 2. Decode and Parse JWT

const decodeAndParseJWT = encodedToken => {
    const decodedToken = jwt.decode(encodedToken, { complete: true });
    return {
        kid: get('kid', decodedToken['header']),
        tid:  get('tid', decodedToken['payload']),
    };
}

// 3. Find the Right certificate to validate our JWT


const CREATE_PUB_KEY = publicKey => `
-----BEGIN CERTIFICATE-----
${publicKey}
-----END CERTIFICATE-----
`;

const extractTheCorrectPublicKey = (jwks, kid) => {
    const correctJwk =  pipe(get('keys'), filter(jwk => jwk.kid === kid), get([0, 'x5c']))(jwks);
    return trim(CREATE_PUB_KEY(trim(head(correctJwk))));
}


// 4. Extract the publicKey and validate it with  jwt.verify(jwt, public key, verifyOptions)

const validateToken = (token, publicKey) => {
    const verifyOptions =  {
        algorithms: ["RS256", "RS384", "RS512"],
        issuer: `https://sts.windows.net/${tid}/`,
        audience: APP_ID,
        clockTolerance: 300,
    };
    try {
        const result = jwt.verify(token, publicKey,verifyOptions)
        return result;
    } catch (err) {
        console.logs('TCL ------> : validateToken -> err', JSON.stringify(err, null, 4))
        throw new Error(err);
    }
}


// Main

const main = async JWT => {

// const microsoftJWKsURL = `https://login.microsoftonline.com/common/.well-known/openid-configuration`;
const microsoftJWKsURL = `https://login.microsoftonline.com/common/discovery/v2.0/keys`;
    const jwks = await fetchJWKs(microsoftJWKsURL);
    const {kid, tid} = decodeAndParseJWT(JWT);
    if(!kid) {
        console.error("invalid JWK, no 'kid' key");
    }
   const publicKey = await  extractTheCorrectPublicKey(jwks, kid)
    const result =  validateToken(JWT, publicKey, tid);
    console.log('TCL ------> : main -> result', result);
    return result;
}

main(validEncodedJWT);
main(badEncodedJWT);