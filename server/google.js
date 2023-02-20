/*  EXPRESS */
//Importando o framework Express e instanciando-o
const express = require('express');
const app = express();

//Importando o framework Express-Session e instanciando-o
const session = require('express-session');

//Importando o querystring
let querystring = require('querystring');

//?
//app.set('view engine', 'ejs');
//Definindo sessões do site
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
}));

//Home do site (renderizam o site)
/*
app.get('/', function(req, res) {
    res.render('pages/auth');
});
*/
//Definindo a porta para o servidor Node.js e abrindo-a
const port = process.env.PORT || 1989;
app.listen(port, () => console.log('Executando na porta ' + port));


/*  CONFIGURAÇAO DO PASSPORT  */

//Importando o framework Passport
const passport = require('passport');
let userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.get('/error', (req, res) => res.send("Erro ao logar"));

//app.get('/success', (req, res) => res.redirect('http://localhost:1003/usuarios/' + userProfile._json.email)); //testar se ele ta levando pro font 
app.get('/success', (req, res) => res.redirect('http://localhost:3113/validarusu?email=' + userProfile._json.email +
    '&foto=' + userProfile._json.picture)); //testar se ele ta levando pro font

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
const GOOGLE_CLIENT_ID = '292240192338-aabj8jhresnli43qgarsk996i1o2nn16.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

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
    passport.authenticate('google', { failureRedirect: '/error' }),
    function (req, res) {

        // Autenticaçao correta, redirecionamento correto.
        console.log(userProfile._json);
        res.redirect('/success');
    });
