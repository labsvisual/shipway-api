import rp from 'request-promise';

import q from 'q';
import _ from 'underscore';

class Shipway {

    _getCarriers() {

        let promise = q.defer();

        rp( {

            uri: `${ this._apiUri }carriers`,
            json:true

        } ).then( ( data ) => {

            promise.resolve( {

                carriers: ( ( _data ) => {

                    _data = _.pick( _data, 'couriers' ).couriers;
                    _data.forEach( ( carrier ) => {

                        delete carrier.image;

                    } );

                    return _data;

                } )( data )

            } );

        } ).catch( ( err ) => {

            promise.reject( err );

        } );

        return promise.promise;

    }


    /**
     * Initialises a new instance of the Shipway API.
     * @param username - the username to use for the API
     * @param licenseKey - the license key for the API
     */
    constructor( username, licenseKey ) {

        this._username = username;
        this._licenseKey = licenseKey;

        this._apiUri = "https://shipway.in/api/";

        this._carriers = null;

        this._getCarriers().then( ( data ) => {
            this._carriers = data;
        } );

    }

    /**
     * Gets the username for the current instance
     * @returns {String} username
     */
    getUsername() {

        return this._username;

    }

    /**
     * Gets the license key for the current instance
     * @returns {String} license key
     */
    getLicenseKey() {

        return this._licenseKey;

    }

    /**
     * Gets a list of carriers available for use with the Shipway API.
     * @return {Object} returns an array of objects with the carriers
     */
    getCarriers() {

        return this._carriers;

    }

    /**
     * Gets the information related to the provided order ID
     * @param orderId the order to track
     * @return {Object} returns the shipment information
     */
    getShipmentDetail( orderId ) {

        let promise = q.defer();

        if( !orderId ) {
            throw new Error( 'no order ID was specified' );
        }

        if( !this._licenseKey || !this._username ) {
            throw new Error( 'no license key or username was provided for this instance' );
        }

        rp( {

            uri: `${ this._apiUri }getOrderShipmentDetails`,
            method: 'POST',
            body: {

                username: this._username,
                password: this._licenseKey,
                order_id: orderId,

            },
            json: true

        } ).then( ( data ) => {

            data = data.response;

            let returnData = {

                carrierDetails: {

                    airWayBillNumber: data.awbno,
                    carrier: data.carrier,
                    pickUpDate: new Date( data.pickupdate ),

                },

                currentStatus: {

                    status: data.current_status,
                    statusCode: data.current_status_code

                },

                customerInformation: {

                    recipient: data.recipient,
                    reference: data.extra_fields.customerReference,

                },

                courierInformation: {

                    originCity: Helpers.capitalize( data.from ),
                    destinationCity: Helpers.capitalize( data.to ),
                    destinationPincode: data.extra_fields.destination_pincode,
                    quantity: data.extra_fields.quantity,
                    serviceType: data.extra_fields.service_type,
                    packageContent: data.extra_fields.packege_content,

                },

                scans: ( ( _data ) => {

                    let scanArr = [];

                    _data.scan.forEach( ( scan ) => {

                        scanArr.push( new Scan( scan.time, scan.location, scan.status_detail ) );

                    } );

                    return scanArr;

                } )( data ),

                trackingUrl: data.tracking_url

            };

            promise.resolve( returnData );

        } ).catch( ( err ) => {

            promise.reject( err );

        } );

        return promise.promise;

    }

    addNewShipment( options ) {

        let promise = q.defer();

        if( !options ) {
            throw new Error( 'options to create a new shipment weren\'t provided' );
        }

        if( !this._licenseKey || !this._username ) {
            throw new Error( 'no license key or username was provided for this instance' );
        }

        const verificationDetails = Helpers.verifyOptions( options );

        if( !verificationDetails.pass ) {

            promise.reject( verificationDetails.reason );

        }else {

            rp( {

                uri: `${ this._apiUri }pushOrderData`,
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

            } ).then( ( data ) => {

                if( data.status.toLowerCase() === 'success' ) {

                    promise.resolve();

                }else {

                    promise.reject( data.message || data.msg );

                }

            } ).catch( ( err ) => {

                promise.reject( err );

            } );

        }

        return promise.promise;

    }

}

class Scan {

    /**
     * Initializes a new instance of the Scan class with the specified parameters.
     * @param time the time of the scan event
     * @param location the location of the scan event
     * @param detail the detail associated with the event
     */
    constructor( time, location, detail ) {

        this._time = time;
        this._location = location;
        this._detail = detail;


    }

    /**
     * Gets the date of the scan
     * @return {Date}
     */
    getTime() {
        return new Date( this._time );
    }

    /**
     * Gets the location of the scan
     * @return {string}
     */
    getLocation() {
        return Helpers.capitalize( this._location );
    }

    /**
     * Gets the detail of the scan
     * @return {string}
     */
    getDetail() {
        return this._detail;
    }

}

const Helpers = {

    capitalize( str ) {

        return ( str.substring( 0, 1 ).toUpperCase() + str.substring( 1 ) );

    },

    verifyOptions( options ) {

        if( Object.prototype.toString.call( options ) != '[object Object]' ) {

            return {
                pass: false,
                reason: 'the passed parameter is not an object'
            };

        }

        if( Object.keys( options ).length === 0 ) {

            return {
                pass: false,
                reason: 'invalid number of options provided'
            };

        }

        let pass = true;
        let reason = [];

        const requiredKeys = [ 'carrierId', 'airWayBillNumber', 'orderId', 'email', 'phone',
                               'firstName', 'lastName', 'productDescription', 'company' ];

        let foundKeys = [];

        Object.keys( options ).forEach( ( key ) => {

            if( requiredKeys.indexOf( key ) > -1 ) {

                foundKeys.push( key );

            }

        } );

        let notFound = _.difference( requiredKeys, foundKeys );
        if( notFound.length !== 0 ) {

            pass = false;

            notFound.forEach( ( key ) => {

                reason.push( `${ key } is required but was not found in the options` );

            } );

        }

        return {
            pass,
            reason,
        };

    }

};

export {

    Shipway,
    Scan

};