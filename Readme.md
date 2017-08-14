# Shipway Node.js Wrapper

The simplified Node.js wrapper for the Shipway.in API.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

The latest and most updated copy of the Node and the NPM binary should be installed on the system. In addition to that,
[mocha](https://mochajs.org) should be installed.

### Installing

The installation is pretty simple with a simple `npm install` to install all the modules.

## Running the tests

To run the tests, run the `npm test` command and you should get the mocha output.

### Break down into end to end tests

Since this is a production-level API, a thorough and extensive test of everything possible or used in the library
is a must and for this very reason, the test suite tests the `Scan` class which represents a scan at the courier's
terminal and the main `Shipway` class along with all possible outcomes for it's methods.

A simple example would be the test suite for the the `addNewShipment()` routine. The suite has the following
test cases:

```
should error out when an incorrect number of options are provided
...
should error out with invalid inputs
...
should create a new shipment
```
It's visible that every possible outcome of the library is tested to make sure that it's resilient in real-world
scenarios.

## Deployment

The library is deployment ready and does not require any other modifications to make it run smoothly on a live
production system.

## Built With

* [request](https://github.com/request/request) - A simple wrapper for the `request library`
* [request-promise](https://github.com/request/request-promise) - A wrapper for requests based on promises (Bluebird)

## Contributing

Any and every modification to make this library better is welcome. Do not hesitate in dropping a pull request.

## Versioning

The library uses [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/labsvisual/shipway-api/tags).

## License

This project is licensed under the MIT License.

## Acknowledgments

* [PurpleBooth](https://github.com/PurpleBooth) for the excellent [Readme template](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2)