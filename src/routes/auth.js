import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';

module.exports = app => {
    const Users = app.db.models.Users;

    app.route('/api/auth')
        .get((req, res) => {
            res.send("Api Auth");
        })

    app.route('/auth')
        .post((req, res) => {
            Users.findOne({
                    where: {
                        user_name: req.body.user_name
                    }
                })
                .then(result => {
                    // If user doesn't exists show message
                    if (!result) return res.status(404).send({message: "El usuario no esta registrado!"});
                    // If users exists
                    // Decrypt
                    var bytes = CryptoJS.AES.decrypt(result.user_password, 'secret');
                    var passDecrypted = bytes.toString(CryptoJS.enc.Utf8);
                    // If passwords do not match show message
                    if(req.body.user_password !== passDecrypted) return res.status(401).send({ message: "El password es incorrecto", auth: false, token: null });
                    // Gen token
                    var token = jwt.sign({ id: result.user_id }, 'secret', {expiresIn: 60 * 60 * 24});
                    res.status(200).send({
                        message: "Acceso correcto", 
                        auth: true, 
                        token: token, 
                        user_fullname: result.user_fullname,
                        user_id: result.user_id,
                        role_id: result.role_id
                    });
                })
                .catch(error => {
                    res.send(error);
                })
        })
}