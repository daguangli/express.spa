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
function serveSpa(root, options) {
    if (!root) {
        throw new TypeError('root path required')
    }
    if (typeof root !== 'string') {
        throw new TypeError('root path must be a string')
    }
    if (!path.isAbsolute(root)) {
        throw new TypeError('Only absoute path is supported')
    }
    if (options && typeof options !== 'object') {
        throw new TypeError('Options must be of type object')
    }

    var indexFilePath = options && options.indexFile ? path.join(root, options.indexFile) : path.join(root, 'index.html')

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
            if (options.loginUrl && options.loginIndexPath && req.url === options.loginUrl) {
                res.sendFile(path.join(root, options.loginIndexPath), function (err, stat) {
                    if (err) return next(err)
                })
            } else {
                res.sendFile(indexFilePath, function (err, stat) {
                    if (err) return next(err)
                })
            }
        }
    }
}