const { validationResult} = require('express-validator');
const bycrypt = require('bcryptjs');
const User = require('../models/user');

exports.signup = async (req, res, next) => {
    const error = validationResult(req);

    if (!error.isEmpty())  return //se o array de erros NÃO tiver vazio, ou seja, tem erro
    
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    //eu preciso cryptografar isso e usando hash q é mais facil, por isso tem a lib bycrypt, facilitar o codigo pro hasheamento
    //nao vamos armazenar as senhas no db, armazena hash pq se sla, for hackeado não vaza as senhas, hash é irreversivel

    try {
        const hashedPassword = await bycrypt.hash(password, 12); //12 é o numero de rounds, qnto maior, mais seguro

        const UserDetails = {
            name: name,
            email: email,
            password: hashedPassword
        };
        const result = await User.save(UserDetails);

        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}