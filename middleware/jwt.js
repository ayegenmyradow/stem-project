const { decodeToken } = require("../services/jwtService")
function authorization(req, res, next){
    const token = req.cookies.token;
    decodeToken(token, function(err, result){
        if (err){
            console.log(err);
            res.redirect("/login");
            return;
        }
        req.credentials = result;
        next();
    })
}
module.exports = {authorization}