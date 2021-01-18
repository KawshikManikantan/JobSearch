module.exports = function(req,res,next,type){
    if(!req.session.type)
    {
        console.log("No session cookie")
        return res.status(401).json({message:'User is not authorized'})
    }
    else if(req.session.type!==type) {
        console.log("Not same type")
        return res.status(401).json({message: 'User is not authorized'})
    }
    console.log(req.session.type)
    next()
}

