#!/usr/bin/env node

// Save current price
var currentPrice = null;

var request = require('request');

// Format money
Number.prototype.formatMoney = function(c, d, t){
    var n = this, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
    j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};


// Return comparison between current price and old price
function compare(currentPrice, oldPrice) {

    var diffPrice = currentPrice / oldPrice;
    var variation = null;

    // If diff price > 1, it means current price is better
    var diffPerc = null;
    if (diffPrice > 1) {
        diffPerc = diffPrice - 1;
        variation = '+';
    }

    // If diff price < 1, it means current price is worst
    else {
        diffPerc = 1 - diffPrice;
        variation = '-';
    }

    return variation + (diffPerc * 100).toFixed(2) + '%';
}


// Request to external API
request('https://api.coindesk.com/v1/bpi/currentprice.json', function(error, response, body) {
    body = JSON.parse(body);
    var currentPrice = body;

    // Display current price
    console.log('> BTC 1');
    console.log('> ' + body.bpi.USD.code + ' ' + body.bpi.USD.rate_float.formatMoney(0, '.', ','));
    console.log('> ' + body.bpi.GBP.code + ' ' + body.bpi.GBP.rate_float.formatMoney(0, '.', ','));
    console.log('> ' + body.bpi.EUR.code + ' ' + body.bpi.EUR.rate_float.formatMoney(0, '.', ','));
    

    request('https://api.coindesk.com/v1/bpi/historical/close.json', function(error, response, body) {
        body = JSON.parse(body);

        var old30daysPrice = body.bpi[Object.keys(body.bpi)[0]];
        var old7daysPrice = body.bpi[Object.keys(body.bpi)[22]];
        var oldYesterdayPrice = body.bpi[Object.keys(body.bpi)[30]];
        
        // Display compare prices
        console.log('Yesterday: ' + compare(currentPrice.bpi.USD.rate_float, oldYesterdayPrice) + '   7 days: ' + compare(currentPrice.bpi.USD.rate_float, old7daysPrice) + '   30 days: ' + compare(currentPrice.bpi.USD.rate_float, old30daysPrice));
        console.log('Updated: ' + currentPrice.time.updated);
    });
});

