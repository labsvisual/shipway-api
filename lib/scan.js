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
        return ( this._location.substring( 0, 1 ).toUpperCase() + this._location.substring( 1 ) );
    }

    /**
     * Gets the detail of the scan
     * @return {string}
     */
    getDetail() {
        return this._detail;
    }

}

export default Scan;