const { validationResult } = require('express-validator');
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const User = require('../models/user');

exports.signup = async (req, res, next) => {
    const error = validationResult(req);

    if (!error.isEmpty())  return //se o array de erros NÃO tiver vazio, ou seja, tem erro, ele volta e tem q refazer o processo
    
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    //eu preciso cryptografar isso e usando hash q é mais facil, por isso tem a lib bycrypt, facilitar o codigo pro hasheamento
    //nao vamos armazenar as senhas no db, armazena hash pq se sla, for hackeado não vaza as senhas, hash é irreversivel
    
    try {
        const hashedPassword = await bycrypt.hash(password, 12); //12 é o numero de rounds, qnto maior, mais seguro

        const UserDetails = { //isso aqui é o payload que vai realmente pro bd
            name: name,
            email: email,
            password: hashedPassword
        };
        const result = await User.save(UserDetails); //salva no bd

        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.find(email) //usa o metodo find com o parametro email da request pra retornar a linha q corresponde aquele email

        if(user[0].length !== 1) { //n queremos mais nem menos que 1
            const error = new Error('Um usuário com esse e-mail não foi encontrado.')
            error.statusCode = 401;
            throw error;
        }
        //até aqui achou a linha com aquele e-mail, agora ver se a senha bate com ele, lembrando q no bd ta em hash
        const storedUser = user[0][0];
        const isEqual = await bycrypt.compare(password, storedUser.password);
        if (!isEqual) {
            const error = new Error('Senha errada!');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign( //a funçao sign da lib jwt usa um cookie do local storage q pode ser acessado no client
            {
                email: storedUser.email,
                userId: storedUser.id
            },
            'secretfortoken',
            { expiresIn: '1h' }
        );

        res.status(200).json({ token: token, userId: storedUser.id }); //ate aq tudo deu certo entao retorna a response pro client como um json
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}