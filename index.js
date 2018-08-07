const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const crypto = require('crypto');
const cookie = require('cookie');
const nonce = require('nonce')();
const querystring = require('querystring');
const request = require('request-promise');

const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const scopes = "read_products";
const forwardingAddress = "https://f15f4ca3.ngrok.io"; //will change once URL is available

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/shopify', (req, res) => {
    const shop = req.query.shop;
    if (shop) {
        const state = nonce();
        const redirectUri = forwardingAddress + '/shopify/callback';
        const installUrl = "https://" + shop + "admin/ouath/authorize?client_id=" + apiKey +
        "&scope=" + scopes + 
        "&state=" + state +
        "&redirect_uri=" + redirectUri;

        res.cookie('state', state);
        res.redirect(installUrl);
    }

    else
        return res.status(400).send("Missing shop parameter. Please add ?shop=giftersixside.myshopify.com to your request"); 
});

app.get('/shopify/callback', (req, res) => {
    const {shop, hmac, code, state} = req.query;
    const stateCookie = cookie.parse(req.headers.cookie).state;

    if(state != stateCookie)
        return res.status(403).send("Request origin cannot be verified.");

    if(shop && hmac && code) {
        const map = Object.assign({}, req.query);
        delete map["signature"];
        delete map["hmac"];
        const message = querystring.stringify(map);
        const providedHmac = Buffer.from(hmac, "utf-8");
        const generateHash = Buffer.from(
            crypto
            .createHmac("sha256", apiSecret)
            .update(message)
            .digest("hex"), 
            "utf-8"
        );

        let hashEquals = false;

        try {
            hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac)
        }

        catch(e) {
            hashEquals = false;
        }

        if(!hashEquals) {
            return res.status(400).send("Hmac validation failed.");
        }

        res.status(200).send("Hmac validated.");
    }

    else {
        res.status(400).send("Required parameters missing.");
    }

});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});