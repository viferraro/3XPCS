// * Importando as bibliotecas
const express = require('express');
const cors = require('cors');
const app = express();

// * Definindo porta do servidor e ativando cors
app.use(cors());
app.set('port', process.env.PORT || 1003);

// * Importando as rotas
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(require('./routes/ProjetoRoutes'));
app.use(require('./routes/TarefaRoutes'));
app.use(require('./routes/TimeRoutes'));
app.use(require('./routes/UsuarioRoutes'));
app.use(require('./routes/APIsRoutes'));


module.exports = app;


/* GOOGLE AUTH */
//Importando o framework Express-Session e instanciando-o
const session = require('express-session');

//Importando o querystring
let querystring = require('querystring');
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
}));

//Importando o framework Passport
const passport = require('passport');
let userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.get('/google/error', (req, res) => res.send("Erro ao logar"));

//app.get('/success', (req, res) => res.redirect('http://localhost:1003/usuarios/' + userProfile._json.email)); //testar se ele ta levando pro font 
app.get('/google/success', (req, res) => res.redirect('http://localhost:3113/validarusu?email=' + userProfile._json.email +
    '&nome=' + userProfile._json.name + '&foto=' + userProfile._json.picture)); //testar se ele ta levando pro font

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});


/*  Google AUTH  */
//Importando o framework Passport-Google-OAuth
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

//Definindo o seu client ID e Secret do Google (foi cadastrado no API do Google Cloud)

//Importando o .env
require('dotenv').config();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_ID//'292240192338-aabj8jhresnli43qgarsk996i1o2nn16.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_SECRET//'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';

//Requisitando a autenticação do usuário
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:1003/auth/google/callback"
},
    function (accessToken, refreshToken, profile, done) {
        userProfile = profile;
        return done(null, userProfile);
    }
));


app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));


app.get('/auth/google/callback',
    // Autenticação incorreta, redirecionamento para a falha
    passport.authenticate('google', { failureRedirect: '/error' }),
    function (req, res) {

        // Autenticaçao correta, redirecionamento para o sucesso.
        console.log(userProfile._json);
        res.redirect('/google/success');
    });