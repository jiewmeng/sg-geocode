'use strict'

let superagent = require('superagent');
let app = require('koa')();
let router = require('koa-router')();
let staticFiles = require('koa-static')('./public');
let port = process.env.PORT || 8000;

app.use(staticFiles)
	.use(router.routes())
	.listen(port);
console.log(`Listening on port ${port}`);