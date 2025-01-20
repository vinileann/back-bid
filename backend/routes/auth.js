//qnd o user manda os inputs pro server, ele vai validar 1.se o email ja existe, 2.se a senha é valida, 3.se o email é valido --pros nossos parametros. Isso é o auth.js
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const User = require('../models/user');
const authController = require('../controllers/auth');

router.post(
    '/signup',
    [
        body('name').trim().not().isEmpty(),
        body('email').isEmail().withMessage('Erro: Por favor, insira um email válido!')
            .custom(async (email) => {
                const user = await User.find(email); //await pq ta esperando a resposta do banco
                if (user[0].length > 0) {
                    return Promise.reject('Erro: Email já existe!');
                }
            })
            .normalizeEmail(), //dx maiusculo e minusculo no msm patamar
        body('password').trim().isLength({ min: 7 })
    ], authController.signup
);

module.exports = router;