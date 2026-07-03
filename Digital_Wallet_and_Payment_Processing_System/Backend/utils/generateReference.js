const randomUUID = require('crypto');

 function generateReference(){
    return `DH-${Date.now()}-${randomUUID.randomBytes(4).toString('hex')}`
}


module.exports = generateReference