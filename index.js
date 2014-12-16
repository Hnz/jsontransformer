
// Copyright 2014, Hans van Leeuwen
// Released under the MIT license. See LICENSE for details.

var stream = require('stream')
var util = require('util')


/**
 * JSON Transformer 
 *
 * Converts a readable NodeJS stream to a JSON list.
 * More info here: {@link http://nodejs.org/api/stream.html#stream_class_stream_transform}
 *
 * @class
 * @param indent    {Number}   JSON indentation
 * @sort_keys       {Boolean}  Whatever of not to sort the key objects
 * @type {stream.Transformer}
 */
var JsonTransformer = module.exports = function(indent) {

    // allow use without new
    if (!(this instanceof JsonTransformer)) {
        return new JsonTransformer(indent)
    }

    // init Transform
    stream.Transform.call(this, { objectMode: true })

    this.indent = indent
    this.first = true
    this.push('[\n')
}

util.inherits(JsonTransformer, stream.Transform)

JsonTransformer.prototype._transform = function(chunk, enc, cb) {

    if (this.first) {
        this.first = false
    }
    else {
        this.push(',\n')
    }

    var json = JSON.stringify(chunk, undefined, this.indent)

    if (this.indent) {
        var indented_json = ''
        var jsonlines = json.split('\n')

        for (var i in jsonlines) {

            var x = 0
            while (x < this.indent) {
                x++
                indented_json += ' '
            }
            indented_json += jsonlines[i] + '\n'
        }

        // Remove last newline
        json = indented_json.substring(0, indented_json.length - 1)
    }

    this.push(json, enc)
    cb()
}

JsonTransformer.prototype._flush = function(cb) {

    this.push('\n]')
    cb()
}

