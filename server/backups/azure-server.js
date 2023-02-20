/*  EXPRESS */
//Importando o framework Express e instanciando-o
let express = require('express');
let app = express();
let usuarios = require('../models/Usuario.js');
let router = express.Router();

//Importando o cors e implementando-o ao servidor express
let cors = require('cors')
app.use(cors())
app.use(express.json());
app.use('/api/', router);

//Importando funções do Azure e biblioteca mssql
const azfunctions = require('./azure-funcoes')
let sql = require("mssql");

// Cria a instância pra conexão.
let conn = new sql.ConnectionPool(azfunctions.config);

//Definindo a porta para o servidor Node.js e abrindo-a
const port = process.env.PORT || 1003;

app.listen(port, () => console.log('Executando servidor Azure na porta ' + port));


router.use((req, res, next) => {
    console.log('Requisição recebida');
    next();
});    

// <- USUARIO ->

// * RETORNA TODOS OS UNUÁRIOS
app.get('/usuarios', (req, res) => {    
    azfunctions.getUsers()
    .then((result) => {
        if (result.length > 0) {
            res.status(200).json(result);
        }
        res.status(500).json({ message: 'Erro interno' });
    });
});

// * RETORNA UM USUÁRIO ESPECÍFICO
app.get('/usuarios/:email', (req, res) => {    
    let {email} = req.params;
    (azfunctions.getUserByEmail(email)
    .then( async function (user){
        if(user){ 
            res.status(200).json(user);
        }
        else{
            res.status(404).json({message: 'Usuário não encontrado'});
        }
    }));    
});

// * ATUALIZA UM USUÁRIO ESPECÍFICO
app.put("/usuarios/:email", (req, res) => {
    let {email} = req.params;
    let usuario = req.body;

    (azfunctions.userExists(email)
    .then( async (result) => {
        if(result){
        azfunctions.updateUser(usuario)
        .then(async () => {
            res.status(200).json({message: 'Usuário atualizado com sucesso'});
        });
        }
        else {
            res.status(404).json({message: 'Usuário não encontrado'});
        }
    }));
});

// * CADASTRA UM USUÁRIO
app.post('/usuarios', (req, res) => {
    let usuario = req.body;
    azfunctions.addUser(usuario)
    .then(() => {
        res.status(201).json({message: 'Usuário cadastrado com sucesso'});
    });
});

// * DELETA UM USUÁRIO
app.delete('/usuarios/:email', (req, res) => {
    let {email} = req.params;
    azfunctions.deleteUser(email)
    .then(() => {
        res.status(200).json({message: 'Usuário deletado com sucesso'});
    });
});


//VALIDAR USUÁRIO
// app.put("/validarusuario-az", async (req, res) => {
//     //está dando como undefined a linha abaixo...
//     const emailUsu = req.body.emailUsu;
//     const urlImgUsu = req.body.urlImgUsu;

//     conn.connect()
//         // Conexão OK
//         .then(async function () {
//             // Faz a requisição, passando a conexão.
//             let req = new sql.Request(conn);

//             // Chama os métodos do mssql de query para executá-los.
//             req.query('select status FROM dbo.USUARIO WHERE email =\'' + emailUsu + '\'')
//                 .then(async function (recordset) {
//                     console.log(recordset.recordset.length)
//                     if (recordset.recordset.length === 0) {
//                         console.log("Não tenho o cara no bd")
//                         conn.close();
//                         res.send(202, 0);
//                     }
//                     else {
//                         const status = await recordset.recordset[0].status;
//                         console.log("Tenho o cara no bd")
//                         if (status >= 1 && status <= 4) {
//                             //atualizar os dados do cara no banco
//                             conn.connect()
//                                 // Conexão OK
//                                 .then(function () {

//                                     // Faz a requisição, passando a conexão.
//                                     let reqUpd = new sql.Request(conn);

//                                     // query to the database and get the records
//                                     let sqlUpd = 'UPDATE USUARIO SET urlImagem = \'' + urlImgUsu + '\' WHERE email=\'' + emailUsu + '\'';

//                                     reqUpd.query(sqlUpd, function (err) {
//                                         if (err) res.send(500, 'Erro na requisição!'); //console.log(err) 
//                                         else {
//                                             conn.close();
//                                             res.send(202, status);
//                                         }
//                                     });
//                                 })
//                                 // Erros de conexão
//                                 .catch(function (err) {
//                                     console.log(err);
//                                     conn.close();
//                                 });
//                         }
//                         else {
//                             console.log("Cara inativo no bd")
//                             conn.close();
//                             res.send(202, 0);
//                         }
//                     }
//                 })
//                 // Erros de execução da query SQL
//                 .catch(function (err) {
//                     console.log(err);
//                     conn.close();
//                 })

//         })
//         // Erros de conexão
//         .catch(function (err) {
//             console.log(err);
//             conn.close();
//         });


// });

// app.put("/buscarusuario-az", async (req, res) => {
//     //está dando como undefined a linha abaixo...
//     const emailUsu = req.body.emailUsu;

//     conn.connect()
//         // Conexão OK
//         .then(async function () {
//             // Faz a requisição, passando a conexão.
//             let req = new sql.Request(conn);

//             // Chama os métodos do mssql de query para executá-los.
//             req.query('select * FROM dbo.USUARIO WHERE email =\'' + emailUsu + '\'')
//                 .then(async function (recordset) {
//                     if (recordset.recordset.length === 0) {
//                         console.log("Não tenho o cara no bd")
//                         conn.close();
//                         res.send(202, 0);
//                     }
//                     else {
//                         const status = await recordset.recordset[0].status;
//                         console.log("Tenho o cara no bd")
//                         res.send(202, status);
//                     }
//                 })
//                 // Erros de execução da query SQL
//                 .catch(function (err) {
//                     console.log(err);
//                     conn.close();
//                 })

//         })
//         // Erros de conexão
//         .catch(function (err) {
//             console.log(err);
//             conn.close();
//         });


// });

// app.put("/atualizarusuario-az", async (req, res) => {
//     //está dando como undefined a linha abaixo...
//     const email = req.body.emailUsu;
//     const funcao = req.body.funcao;
//     const cep = req.body.cep;
//     const numEnd = req.body.numEnd;
//     const complEnd = req.body.complEnd;
//     const linkedin = req.body.linkedin;
//     const github = req.body.github;

//     conn.connect()
//         // Conexão OK
//         .then(async function () {
//             // Faz a requisição, passando a conexão.
//             let req = new sql.Request(conn);

//             let sqlUpd = 'UPDATE USUARIO SET funcao = \'' + funcao + '\', CEP = \'' +
//                 cep + '\', CEP_numEnd=\'' + numEnd + '\', CEP_complemento=\'' + complEnd +
//                 '\', linkedin=\'' + linkedin + '\', github=\'' + github + '\' WHERE email=\'' + email + '\'';

//             // Chama os métodos do mssql de query para executá-los.
//             req.query(sqlUpd, function (err) {
//                 if (err) res.send(500, 'Erro na requisição!'); //console.log(err) 
//                 else {
//                     conn.close();
//                     res.send(202, status);
//                 }
//             });
//         })
//         // Erros de conexão
//         .catch(function (err) {
//             console.log(err);
//             conn.close();
//         });

// });