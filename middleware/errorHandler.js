const errorHnadler = (err, req, res, next)=>{
    const statusCode = req.status ? req.status : 500
    res.status(statusCode)
    res.json({
        message : err.message, 
        stack : process.env.NODE_ENV==="dev"? err.stack :null
    })
}
module.exports = errorHnadler