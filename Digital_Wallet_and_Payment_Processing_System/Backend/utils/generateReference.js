const randomUUID = require('crypto');

async function generateReference(){
    return `DH-${Date.now()}-${randomUUID.randomBytes(4).toString('hex')}`
}


module.exports = generateReference