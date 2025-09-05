let jwt = require('jsonwebtoken');
const secret = "iwjqheiorjqwioejoiqwjeopiqwjroihnfgioubhnfrgoikb";


module.exports = function(req, res, next) {
    const authToken = req.headers['authorization'];
    if (authToken != undefined) {
        const bearer = authToken.split(' ');
        let token = bearer[1];
        try{
            let decoded = jwt.verify(token, secret);
            if (decoded.role == 1) {
            next();
            }
            else {
                res.status(403);
                res.send("You dont have admin permissions");
                return;
            }
        } catch(err){
            res.status(403);
            res.send("You need to be authenticated");
            return;
        }
    } else{
        res.status(403);
        res.send("You need to be authenticated");
        return;
    }
}