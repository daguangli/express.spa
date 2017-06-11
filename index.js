/*!
 * express.spa
 * Copyright(c) 2017 Daguang Li
 * MIT Licensed
 */

'use strict'

const debug = require('debug')('express.spa')
const path = require('path')
const fs = require('fs')
module.exports = serveSpa
function serveSpa(opts) {
    var opts = opts || {}
        , root = opts.root || __dirname
        , indexFileAbsPath = opts.indexFilePath ? path.join(root, opts.indexFilePath) : root
        , indexFile = opts.indexFileName ? path.join(indexFileAbsPath, opt.indexFileName) : path.join(indexFileAbsPath, 'index.html')

    return function (req, res, next) {
        var lastUrlSection = req.url.substring(req.url.lastIndexOf('/') + 1)
        if (lastUrlSection.indexOf('.') !== -1) {
            var filePath = path.join(root, req.url)
            fs.stat(filePath, function onstat(err, stat) {
                if (err) return next(err)
                res.sendFile(filePath, function (err) {
                    if (err) return next(err)
                })
            })
        } else {
            if (opts.loginUrl && opts.loginIndexPath && req.url === opts.loginUrl) {
                debug('Separate login page url:' + req.url)
                var loginPage
                if (opts.loginFileName) {
                    loginPage = path.join(root, opts.loginIndexPath, opts.loginFileName)
                } else {
                    loginPage = path.join(root, opts.loginIndexPath, 'index.html')
                }
                res.sendFile(loginPage, function (err, stat) {
                    if (err) return next(err)
                })
            } else {
                res.sendFile(indexFile, function (err, stat) {
                    if (err) return next(err)
                })
            }
        }
    }
}