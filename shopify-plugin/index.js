const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const crypto = require('crypto');
const cookie = require('cookie');
const nonce = require('nonce')();
const path = require('path');
const querystring = require('querystring');
const request = require('request-promise');
const server = require('http').createServer(app);
const Shopify = require('shopify-api-node');

const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const extensionId = "cgampgbmlfgmdeklocpnfbbaahaemmgn"; //extension id of google extension plugin would like to interact with
const scopes = "read_products";
var shopify = null;
const forwardingAddress = "https://5676eca4.ngrok.io"; //will change once URL is available

var socket = require('socket.io')(server);
server.listen(3000, function(){
    console.log("Listening on port 3000");
});

socket.on('connection', function(sock) {
    console.log("Connected");
    sock.send('Connected on port 3000');
    sock.on('message', function(msg) {
        console.log(msg);
    });
});



app.get('/shopify', (req, res) => {
    const shop = req.query.shop;
    if (shop) {
        const state = nonce();
        const redirectUri = forwardingAddress + '/shopify/callback';
        const installUrl = 'https://' + shop + '/admin/oauth/authorize?client_id=' + apiKey +
        '&scope=' + scopes + 
        '&state=' + state +
        '&redirect_uri=' + redirectUri;

        res.cookie('state', state);
        res.redirect(installUrl);
    }

    else
        return res.status(400).send("Missing shop parameter. Please add ?shop=shop-name.myshopify.com to your request"); 
});

app.get('/shopify/callback', (req, res) => {
    const {shop, hmac, code, state} = req.query;
    const stateCookie = cookie.parse(req.headers.cookie).state;

    if(state != stateCookie)
        return res.status(403).send("Request origin cannot be verified.");

    if(shop && hmac && code) {
        const map = Object.assign({}, req.query);
        delete map['signature'];
        delete map['hmac'];
        const message = querystring.stringify(map);
        const providedHmac = Buffer.from(hmac, 'utf-8');
        const generatedHash = Buffer.from(
            crypto
            .createHmac('sha256', apiSecret)
            .update(message)
            .digest('hex'), 
            'utf-8'
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

        const accessTokenRequestUrl = "https://" + shop + "/admin/oauth/access_token";
        const accessTokenPayload = {
            client_id : apiKey,
            client_secret : apiSecret,
            code,
        };

        request.post(accessTokenRequestUrl, {json: accessTokenPayload})
        .then((accessTokenResponse) => {
            const accessToken = accessTokenResponse.access_token;

            const shopRequestUrl = 'https://' + shop + '/admin/shop.json';
            const shopRequestHeaders = {
                'X-Shopify-Access-Token': accessToken,
            };

            createInstance(accessToken, shop); //access resources from shop by creating a new instance
        })
        .catch((error) => {
            console.log(error);
            res.status(error.statusCode).send(error.error.error_description);
        });
    }

    else {
        res.status(400).send("Required parameters missing.");
    }

});

function createInstance(access_token, shop_name) {
    console.log("Creating Instance");
    shopify = new Shopify({
        shopName: shop_name,
        accessToken: access_token
    });

}
