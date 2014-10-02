
# node-sequential-ids

[![Build Status](https://travis-ci.org/forfuture-dev/node-sequential-ids.svg?branch=master)](https://travis-ci.org/forfuture-dev/node-sequential-ids)

A [Node.js][nodejs] module that allows centralized generation of
sequential and human-readable ids.

**Sample Id:** `ACB - 00423`

|aspect|detail|
|-------|-----:|
|version|0.0.0-alpha.4.0|
|dependencies|none|
|last updated|2nd Oct, 2014|

## installation

From [Npm][npmjs]:

```bash
$ npm install sequential-ids --save
```

## usage

```js
// assuming `db` is a variable holding a database connection with the
// method `.store(key, value)`

var sequential = require("sequential-ids");
var generator = new sequential.Generator({
  digits: 6, letters: 3,
  store: function(ids) {
    db.store("last-id", ids[ids.length - 1]);
  },
  restore: "AAB - 000"
});

generator.start();
var new_id = generator.generate(); // => AAB - 001

// possibly in another file
var accessor = new sequential.Accessor();
accessor.next(function(id) {
  console.log("new id: %s", id); // => AAB - 002
});
```

## notes

1. **new Generator([options])**

  * you only require to create a single generator instance
  * **options** is an object having the following attributes:

      * `digits`:
          * no. of numbers to use in the ID.
          * numbers will be padded with zeros to satisfy this.
          * assigning `0` (zero) lets you ignore the number part
          * Defaults to `6`.
      * `letters`:
          * no. of letters to use.
          * assigning `0` (zero) lets you ignore the letters part
          * Defaults to `3`.
      * `store`:
          * a function that will be called to store the IDs on disk for persistence.
          * the function is passed an array of IDs that have been generated.
          * repeatedly storing the last id is useful to know where to start from in the next session.
          * Defaults to `null`.
      * `store_freq`:
          * frequency at which the store function should be called.
          * Defaults to `1`(called every 1 ID is generated)
      * `restore`:
          * last ID that was generated.
          * IDs will be generated from here on.
          * `digits` and `letters` will be ignored so as to follow the restore ID style.
          * it **must** be in the same style as IDs generated by the Generator
          * If not specified, generates from start.
          * **MUST** be a string.
          * Defaults to `null`.
      * `port`:
          * port at which the generator serves IDs.
          * Defaults to `9876`.

  * in a case where you may require more than one generator, you would allocate them to different ports. See ahead on how to target each of the different generators.

```js
var sequential = require("sequential-ids");
var generatorA = new sequential.Generator({port: 8998});
var generatorB = new sequential.Generator({port: 7667});
```

  * A generator has the following methods:

    * `Generator#start()`

      * starts the generator. If no Error is thrown, the generator will be ready for Accessors.

    * `Generator#generate()`

      * generates a new id. The new id is returned immediately.

    * `Generator#stop()`

      * stops the generator. No more ids will be given to Accessors.


2. **new Accessor([port])**

  * used to access ids.
  * **port** is the port number of your generator. In case where, you did not specify a port when creating a Generator instance, you may leave this out. Defaults to `9876`.
  * an accessor may be initialized in a separate file. Ensure you got the port numbers correct.
  * an accessor has the following methods:

    * `Accessor#next(callback)`:
        * requests generator for a new ID.
        * The new ID is passed to the callback.

  * All methods are **asynchronous**, the Node.js way


## TODO

* Robust Error handling
* Implement these features:
    * `session(callback)` - passes the number of IDs generated in the session.
    * `.used(callback)` - passes the total number of IDs generated.
    * `.semantics(callback)` - passes the remaining no. of ids to be generated before breaking our semantics specified while creating the generator.


## contribution

* Source Code is hosted on [Github][repo]
* Pull requests be accompanied with tests as in the `/tests` directory
* Issues may be filed [here][issues]

## license

Copyright (c) 2014 Forfuture LLC

Sequential Ids and its source code are licensed under the [MIT][mit] license. See *LICENSE* file accompanying this text.


[issues]:https://github.com/forfuture-dev/node-sequential-ids/issues
[mit]:https://opensource.org/licenses/MIT
[nodejs]:https://nodejs.org
[npmjs]:https://npmjs.org/sequential-ids
[repo]:https://github.com/forfuture-dev/node-sequential-ids
