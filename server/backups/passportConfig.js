const GoogleStrategy = require("passport-google-oauth2").Strategy;
const User = require("./userModel");

module.exports = (passport) => {
    passport.use(new GoogleStrategy({
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/google/callback",
            passReqToCallback : true
        },
        async (request, accessToken, refreshToken, profile, done) => {
        //Verificando se o usuário existe no banco ou não (Era uma estratégia com MongoDB, avaliar com o Firebase ou BigQuery)
            try {
                let existingUser = await User.findOne({ 'google.id': profile.id });
                // Se ele existir, retorne-o
                if (existingUser) {
                    return done(null, existingUser);
                }
                // Se não, crie-o no banco...
                console.log('Criando novo usuário...');
                /*const newUser = new User({
                    method: 'google',
                    google: {
                        id: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value
                    }
                });
                await newUser.save();
                return done(null, newUser);*/
                return done(null, {'google id': profile.id});
            } catch (error) {
                return done(error, false)
            }
        }
    ));
}