
/**************************
 * Copyright 2014 Dimebox *
 **************************/

'use strict';

var assert = require('assert')
var stream = require('stream')
var util = require('util')
var JSONTransformer = require('./index.js')

describe("JsonTransformer", function() {

    it("transformers a readable stream to json", function(cb) {

        var buffer = []

        var rs = new stream.Readable({ objectMode: true })
        rs.push({id:1, name: 'Rob Roy'})
        rs.push('Foo Bar')
        rs.push(123)
        rs.push(null)

        rs
            .pipe(new JSONTransformer())
            .on('error', cb)
            .on('data', function (chunk) {
                buffer.push(chunk)
            })
            .on('end', function () {
                var json = buffer.join('')
                var res = JSON.parse(json)
                assert.deepEqual(res, [{"id":1,"name":"Rob Roy"}, "Foo Bar", 123]) 
                cb()
            })
    })
})

