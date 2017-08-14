'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Scan = exports.Shipway = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Shipway = function () {
    _createClass(Shipway, [{
        key: '_getCarriers',
        value: function _getCarriers() {

            var promise = _q2.default.defer();

            (0, _requestPromise2.default)({

                uri: this._apiUri + 'carriers',
                json: true

            }).then(function (data) {

                promise.resolve({

                    carriers: function (_data) {

                        _data = _underscore2.default.pick(_data, 'couriers').couriers;
                        _data.forEach(function (carrier) {

                            delete carrier.image;
                        });

                        return _data;
                    }(data)

                });
            }).catch(function (err) {

                promise.reject(err);
            });

            return promise.promise;
        }

        /**
         * Initialises a new instance of the Shipway API.
         * @param username - the username to use for the API
         * @param licenseKey - the license key for the API
         */

    }]);

    function Shipway(username, licenseKey) {
        var _this = this;

        _classCallCheck(this, Shipway);

        this._username = username;
        this._licenseKey = licenseKey;

        this._apiUri = "https://shipway.in/api/";

        this._carriers = null;

        this._getCarriers().then(function (data) {
            _this._carriers = data;
        });
    }

    /**
     * Gets the username for the current instance
     * @returns {String} username
     */


    _createClass(Shipway, [{
        key: 'getUsername',
        value: function getUsername() {

            return this._username;
        }

        /**
         * Gets the license key for the current instance
         * @returns {String} license key
         */

    }, {
        key: 'getLicenseKey',
        value: function getLicenseKey() {

            return this._licenseKey;
        }

        /**
         * Gets a list of carriers available for use with the Shipway API.
         * @return {Object} returns an array of objects with the carriers
         */

    }, {
        key: 'getCarriers',
        value: function getCarriers() {

            return this._carriers;
        }

        /**
         * Gets the information related to the provided order ID
         * @param orderId the order to track
         * @return {Object} returns the shipment information
         */

    }, {
        key: 'getShipmentDetail',
        value: function getShipmentDetail(orderId) {

            var promise = _q2.default.defer();

            if (!orderId) {
                throw new Error('no order ID was specified');
            }

            if (!this._licenseKey || !this._username) {
                throw new Error('no license key or username was provided for this instance');
            }

            (0, _requestPromise2.default)({

                uri: this._apiUri + 'getOrderShipmentDetails',
                method: 'POST',
                body: {

                    username: this._username,
                    password: this._licenseKey,
                    order_id: orderId

                },
                json: true

            }).then(function (data) {

                data = data.response;

                var returnData = {

                    carrierDetails: {

                        airWayBillNumber: data.awbno,
                        carrier: data.carrier,
                        pickUpDate: new Date(data.pickupdate)

                    },

                    currentStatus: {

                        status: data.current_status,
                        statusCode: data.current_status_code

                    },

                    customerInformation: {

                        recipient: data.recipient,
                        reference: data.extra_fields.customerReference

                    },

                    courierInformation: {

                        originCity: Helpers.capitalize(data.from),
                        destinationCity: Helpers.capitalize(data.to),
                        destinationPincode: data.extra_fields.destination_pincode,
                        quantity: data.extra_fields.quantity,
                        serviceType: data.extra_fields.service_type,
                        packageContent: data.extra_fields.packege_content

                    },

                    scans: function (_data) {

                        var scanArr = [];

                        _data.scan.forEach(function (scan) {

                            scanArr.push(new Scan(scan.time, scan.location, scan.status_detail));
                        });

                        return scanArr;
                    }(data),

                    trackingUrl: data.tracking_url

                };

                promise.resolve(returnData);
            }).catch(function (err) {

                promise.reject(err);
            });

            return promise.promise;
        }
    }, {
        key: 'addNewShipment',
        value: function addNewShipment(options) {

            var promise = _q2.default.defer();

            if (!options) {
                throw new Error('options to create a new shipment weren\'t provided');
            }

            if (!this._licenseKey || !this._username) {
                throw new Error('no license key or username was provided for this instance');
            }

            var verificationDetails = Helpers.verifyOptions(options);

            if (!verificationDetails.pass) {

                promise.reject(verificationDetails.reason);
            } else {

                (0, _requestPromise2.default)({

                    uri: this._apiUri + 'pushOrderData',
                    method: 'POST',
                    body: {

                        username: this._username,
                        password: this._licenseKey,
                        carrier_id: options.carrierId,
                        awb: options.airWayBillNumber,
                        order_id: options.orderId,
                        email: options.email,
                        first_name: options.firstName,
                        last_name: options.lastName,
                        products: options.productDescription,
                        company: options.company,
                        phone: options.phone

                    },
                    json: true

                }).then(function (data) {

                    if (data.status.toLowerCase() === 'success') {

                        promise.resolve();
                    } else {

                        promise.reject(data.message || data.msg);
                    }
                }).catch(function (err) {

                    promise.reject(err);
                });
            }

            return promise.promise;
        }
    }]);

    return Shipway;
}();

var Scan = function () {

    /**
     * Initializes a new instance of the Scan class with the specified parameters.
     * @param time the time of the scan event
     * @param location the location of the scan event
     * @param detail the detail associated with the event
     */
    function Scan(time, location, detail) {
        _classCallCheck(this, Scan);

        this._time = time;
        this._location = location;
        this._detail = detail;
    }

    /**
     * Gets the date of the scan
     * @return {Date}
     */


    _createClass(Scan, [{
        key: 'getTime',
        value: function getTime() {
            return new Date(this._time);
        }

        /**
         * Gets the location of the scan
         * @return {string}
         */

    }, {
        key: 'getLocation',
        value: function getLocation() {
            return Helpers.capitalize(this._location);
        }

        /**
         * Gets the detail of the scan
         * @return {string}
         */

    }, {
        key: 'getDetail',
        value: function getDetail() {
            return this._detail;
        }
    }]);

    return Scan;
}();

var Helpers = {
    capitalize: function capitalize(str) {

        return str.substring(0, 1).toUpperCase() + str.substring(1);
    },
    verifyOptions: function verifyOptions(options) {

        if (Object.prototype.toString.call(options) != '[object Object]') {

            return {
                pass: false,
                reason: 'the passed parameter is not an object'
            };
        }

        if (Object.keys(options).length === 0) {

            return {
                pass: false,
                reason: 'invalid number of options provided'
            };
        }

        var pass = true;
        var reason = [];

        var requiredKeys = ['carrierId', 'airWayBillNumber', 'orderId', 'email', 'phone', 'firstName', 'lastName', 'productDescription', 'company'];

        var foundKeys = [];

        Object.keys(options).forEach(function (key) {

            if (requiredKeys.indexOf(key) > -1) {

                foundKeys.push(key);
            }
        });

        var notFound = _underscore2.default.difference(requiredKeys, foundKeys);
        if (notFound.length !== 0) {

            pass = false;

            notFound.forEach(function (key) {

                reason.push(key + ' is required but was not found in the options');
            });
        }

        return {
            pass: pass,
            reason: reason
        };
    }
};

exports.Shipway = Shipway;
exports.Scan = Scan;