JsonTransformer
===============

Converts a readable NodeJS stream to a JSON list.

## Installation

    npm install jsontransformer


## The problem

Say you have a web application that loads documents from a database and
exposes them as JSON through an API.

Using [Express](http://mongoosejs.com/) and
[Mongoose](http://mongoosejs.com/), we would do something like this:

```js
app.get('/api/documents', function (request, response) {

    mongoose
    .model('Documents') .find(function(err, res) {

	    if (err) {
		response.sendStatus(500)
	    } else {
		response.json(res)
	    }
	})
})
```

The above approach loads all the documents from the database, and then returns
them all at once.

All good right?  Well, say that each document we retrieve is 50kb.  And that
we need to retrieve 10000 documents. The server would use about 500 MB of RAM. 
That's a bit much, isn't it?

Another downside is that the server will only start sending the results if the
dataset has been retrieved entirely.

As you can see, this approach is slow and inefficient.


## The solution

Use [streams](nodejs.org/api/stream.html)!

Here we refactor the above code to use streams with JSONTransformer:

```js
app.get('/api/documents', function (request, response) {

    response.set('Content-Type', 'application/json')

    mongoose
	.model('Documents') .find() .stream() .pipe(new JSONTransformer())
	.pipe(response)
})
```

Now the application requests the documents, and as soon as the first document
is received, it is send to the client immediately.

So no unnecessary buffering, and no waiting for the dataset to be fully
loaded.
