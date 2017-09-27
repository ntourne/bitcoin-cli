#! /usr/local/bin/node

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

// Request to external API
request('https://api.coindesk.com/v1/bpi/currentprice.json', function(error, response, body) {
    body = JSON.parse(body);
    console.log('BTC 1');
    console.log(body.bpi.USD.code + ' ' + body.bpi.USD.rate_float.formatMoney(0, '.', ','));
    console.log(body.bpi.GBP.code + ' ' + body.bpi.GBP.rate_float.formatMoney(0, '.', ','));
    console.log(body.bpi.EUR.code + ' ' + body.bpi.EUR.rate_float.formatMoney(0, '.', ','));
    console.log('Updated: ' + body.time.updated);
})