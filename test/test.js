import {
    Shipway,
    Scan
} from '../index';

import { expect } from 'chai';

const configuration = require( './shipway.json' );

let shipway = null;
describe( 'Shipway Class', () => {

    beforeEach( () => {

        shipway = new Shipway( configuration.username, configuration.licenseKey );

    } );

    it( 'initialises correctly', () => {

        expect( shipway.getUsername() ).to.be.a( 'string' );
        expect( shipway.getLicenseKey() ).to.be.a( 'string' );

        expect( shipway.getUsername() ).to.equal( configuration.username );
        expect( shipway.getLicenseKey() ).to.equal( configuration.licenseKey);

    } );

    describe( '_getCarriers()', () => {

        let p = null

        beforeEach( () => {

            p = shipway._getCarriers();

        } );

        describe( 'successfully gets a list of available carriers', () => {

            it( 'should be an object', ( done ) => {

                p.then( ( data ) => {

                    expect( data ).to.be.an( 'object' );
                    done();

                } ).catch( ( err ) => {

                    done( `Error encountered: ${ err }` );

                } );

            } ).timeout( 3500 );

            it( 'should have the \'carriers\' property', ( done ) => {

                p.then( ( data ) => {

                    expect( data ).to.have.property( 'carriers' );
                    done();

                } ).catch( ( err ) => {

                    done( `Error encountered: ${ err }` );

                } );

            } ).timeout( 3500 );

            it( 'should have an array of carriers', ( done ) => {

                p.then( ( data ) => {

                    expect( data.carriers ).to.be.an( 'array' );
                    done();

                } ).catch( ( err ) => {

                    done( `Error encountered: ${ err }` );

                } );

            } ).timeout( 3500 );

        } );

    } );

    describe( 'getShipmentDetail()', () => {

        let p = null;
        beforeEach( () => {

            p = shipway.getShipmentDetail( 11 );

        } );

        it( 'should have an object', ( done ) => {

            p.then( ( data ) => {

                expect( data ).to.be.an( 'object' )
                done();

            } ).catch( ( err ) => {

                done( `Error encountered: ${ err }` );

            } );

        } ).timeout( 3500 );

        it( 'should have all the properties', ( done ) => {

            p.then( ( data ) => {

                expect( data ).to.have.property( 'carrierDetails' );
                expect( data ).to.have.property( 'currentStatus' );
                expect( data ).to.have.property( 'customerInformation' );
                expect( data ).to.have.property( 'courierInformation' );
                expect( data ).to.have.property( 'scans' );
                expect( data ).to.have.property( 'trackingUrl' );

                done();

            } ).catch( ( err ) => {

                done( `Error encountered: ${ err }` );

            } );

        } ).timeout( 3500 );

        describe( 'should have all the sub-properties', () => {

            describe( '#carrierDetails', () => {

                it( 'should have all sub properties', ( done ) => {

                    p.then( ( data ) => {

                        expect( data.carrierDetails ).to.have.property( 'airWayBillNumber' );
                        expect( data.carrierDetails.airWayBillNumber ).to.be.a( 'string' );

                        expect( data.carrierDetails ).to.have.property( 'carrier' );
                        expect( data.carrierDetails.carrier ).to.be.a( 'string' );

                        expect( data.carrierDetails ).to.have.property( 'pickUpDate' );
                        expect( data.carrierDetails.pickUpDate ).to.be.a( 'date' );

                        done();

                    } ).catch( ( err ) => {

                        done( `Error encountered: ${ err }` );

                    } );

                } ).timeout( 3500 );

            } );

            describe( '#currentStatus', () => {

                it( 'should have all sub properties', ( done ) => {

                    p.then( ( data ) => {

                        expect( data.currentStatus ).to.have.property( 'status' );
                        expect( data.currentStatus .status ).to.be.a( 'string' );

                        expect( data.currentStatus ).to.have.property( 'statusCode' );
                        expect( data.currentStatus .statusCode ).to.be.a( 'string' );

                        done();

                    } ).catch( ( err ) => {

                        done( `Error encountered: ${ err }` );

                    } );

                } ).timeout( 3500 );

            } );

            describe( '#customerInformation', () => {

                it( 'should have all sub properties', ( done ) => {

                    p.then( ( data ) => {

                        expect( data.customerInformation ).to.have.property( 'recipient' );
                        expect( data.customerInformation .recipient ).to.be.a( 'string' );

                        expect( data.customerInformation ).to.have.property( 'reference' );
                        expect( data.customerInformation .reference ).to.be.a( 'string' );

                        done();

                    } ).catch( ( err ) => {

                        done( `Error encountered: ${ err }` );

                    } );

                } ).timeout( 3500 );

            } );

            describe( '#courierInformation', () => {

                it( 'should have all sub properties', ( done ) => {

                    p.then( ( data ) => {

                        expect( data.courierInformation ).to.have.property( 'originCity' );
                        expect( data.courierInformation .originCity ).to.be.a( 'string' );

                        expect( data.courierInformation ).to.have.property( 'destinationCity' );
                        expect( data.courierInformation .destinationCity ).to.be.a( 'string' );

                        expect( data.courierInformation ).to.have.property( 'destinationPincode' );
                        expect( data.courierInformation .destinationPincode ).to.be.a( 'string' );

                        expect( data.courierInformation ).to.have.property( 'quantity' );
                        expect( data.courierInformation .quantity ).to.be.a( 'string' );

                        expect( data.courierInformation ).to.have.property( 'serviceType' );
                        expect( data.courierInformation .serviceType ).to.be.a( 'string' );

                        expect( data.courierInformation ).to.have.property( 'packageContent' );
                        expect( data.courierInformation .packageContent ).to.be.a( 'string' );

                        done();

                    } ).catch( ( err ) => {

                        done( `Error encountered: ${ err }` );

                    } );

                } ).timeout( 3500 );

            } );

            describe( '#scans', () => {

                it( 'should have all sub properties', ( done ) => {

                    p.then( ( data ) => {

                        expect( data.scans ).to.be.an( 'array' );

                        expect( data.scans[ 0 ] ).to.have.property( '_time' );
                        expect( data.scans[ 0 ] ).to.have.property( '_location' );
                        expect( data.scans[ 0 ] ).to.have.property( '_detail' );

                        done();

                    } ).catch( ( err ) => {

                        done( `Error encountered: ${ err }` );

                    } );

                } ).timeout( 3500 );

            } );

            describe( '#trackingUrl', () => {

                it( 'should be a string', ( done ) => {

                    p.then( ( data ) => {

                        expect( data.trackingUrl ).to.be.an( 'string' );

                        done();

                    } ).catch( ( err ) => {

                        done( `Error encountered: ${ err }` );

                    } );

                } ).timeout( 3500 );

            } );

        } );

    } );

    describe( 'addNewShipment()', () => {

        let p = null;
        beforeEach( () => {

            p = null;

        } );

        it( 'should error out when an incorrect number of options are provided', ( done ) => {

            p = shipway.addNewShipment( {} );

            p.then( ( data ) => {

                done( 'the promise resolved' );

            } ).catch( ( err ) => {

                expect( err ).to.equal( 'invalid number of options provided' );
                done();

            } );

        } ).timeout( 3500 );

        it( 'should error out when the parameter is not an object', ( done ) => {

            p = shipway.addNewShipment( 'testString' );

            p.then( ( data ) => {

                done( 'the promise resolved' );

            } ).catch( ( err ) => {

                expect( err ).to.equal( 'the passed parameter is not an object' );
                done();

            } );

        } ).timeout( 3500 );

        it( 'should error out when the parameter is not an object', ( done ) => {

            p = shipway.addNewShipment( {

                carrierId: '',
                airWayBillNumber: '',
                orderId: '',

            } );

            p.then( ( data ) => {

                done( 'the promise resolved' );

            } ).catch( ( err ) => {

                expect( err ).to.be.an( 'array' ).with.length( 6 );
                done();

            } );

        } ).timeout( 3500 );

        it( 'should error out with the \'invalid inputs\' message', ( done ) => {

            p = shipway.addNewShipment( {

                carrierId: '',
                airWayBillNumber: '',
                orderId: '',
                email: '',
                phone: '',
                firstName: '',
                lastName: '',
                productDescription: '',
                company: ''

            } );

            p.then( ( data ) => {

                done( 'the promise resolved' );

            } ).catch( ( err ) => {

                expect( err.toLowerCase() ).to.equal( 'invalid inputs' );
                done();

            } );

        } ).timeout( 3500 );

        it( 'should create a new shipment', ( done ) => {

            p = shipway.addNewShipment( {

                carrierId: '7',
                airWayBillNumber: 'M55321779',
                orderId: '19',
                email: 'something@example.com',
                phone: '9876543210',
                firstName: 'John',
                lastName: 'Doe',
                productDescription: 'Example product',
                company: 'Acme Inc'

            } );

            p.then( ( data ) => {

                done();

            } ).catch( ( err ) => {

                done( `Error encountered: ${ err }` );

            } );

        } ).timeout( 3500 );

    } );

} );

let scan = null;
describe( 'Scan Class', () => {

    beforeEach( () => {

        scan = new Scan( '2017-08-12 22:04:00', 'delhi hub', 'Processed & Forwarded From Hub' );

    } );

    it( 'should return a valid date', () => {

        expect( scan.getTime() ).to.be.a( 'date' );
        expect( scan.getTime().toString() ).to.equal( 'Sat Aug 12 2017 22:04:00 GMT+0530 (IST)' );

    } );

    it( 'should return a valid location identifier', () => {

        expect( scan.getLocation() ).to.be.a( 'string' );
        expect( scan.getLocation() ).to.be.of.length( 'delhi hub'.length );

    } );

    it( 'should return a valid scan detail string', () => {

        expect( scan.getDetail() ).to.be.a( 'string' );
        expect( scan.getDetail() ).to.be.of.length( 'Processed & Forwarded From Hub'.length );

    } );


} );