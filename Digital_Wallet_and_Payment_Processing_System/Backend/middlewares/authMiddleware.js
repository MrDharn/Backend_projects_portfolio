const authenticationMiddleware = async(req, res, next)=>{
    try{
        console.log("This is middleware")
        next()
    }catch(e){
        console.log('you are not authorized')
    }
}

module.exports = authenticationMiddleware