export class Exception extends Error {
    constructor(message) {
        super(message);
        console.log(message);
    }
}

