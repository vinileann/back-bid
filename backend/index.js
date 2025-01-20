const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error');

const app = express();

const ports = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/auth', authRoutes); //rota de autenticação
app.use(errorController.get404); //se n chegar na /auth, vai cair no erro 404

app.use(errorController.get500); //no ultimo caso de erro, vai cair nesse erro

app.listen(ports, () => console.log(`To no porta ${ports}`));