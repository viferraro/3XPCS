// Import the mssql package
let sql = require("mssql");

// Create a configuration object for our Azure SQL connection parameters
let dbConfig = {
  server: "serverdb3x.database.windows.net", // Use your SQL server name
  database: "BD3X", // Database to connect to
  user: "Db3xmanager", // Use your username
  password: "3X_PCS_EEMTV_1024", // Use your password
  port: 1433,
  // Since we're on Windows Azure, we need to set the following options
  options: {
    encrypt: true
  }
};

// Cria a instância pra conexão.
let conn = new sql.ConnectionPool(dbConfig);

async function getUsers(){

  users = [];

  try{
    let pool = await sql.connect(dbConfig)
    let data = await pool.request()
    .query("SELECT * FROM dbo.USUARIO")

    for(let i=0; i<data.rowsAffected; i++){
      users.push(data.recordset[i]);
    }
    
    return users;
  }
  catch(err){
    console.log(err);
  }
}

async function getUserByEmail(email) {
  
  try{
    let pool = await sql.connect(dbConfig)
    let data = await pool.request()
    .input("em", sql.VarChar, email)
    .query("SELECT * FROM dbo.USUARIO WHERE email=@em");
    return data.recordset[0];
  }
  catch(err){
    console.log(err);
  }

}

// Atualizar um usuário
async function updateUser(user) {

  try{
    let pool = await sql.connect(dbConfig)
    let data = await pool.request()
    .input("em", sql.VarChar, user.email)
    .input("nm", sql.VarChar, user.nome)
    .input("fn", sql.VarChar, user.funcao)
    .input("dt", sql.DateTime, user.dtCriacao)
    .input("ui", sql.VarChar, user.urlImagem)
    .input("gh", sql.VarChar, user.github)
    .input("lk", sql.VarChar, user.linkedin)
    .input("cp", sql.VarChar(8), user.CEP)
    .input("cn", sql.Numeric, user.CEP_numEnd)
    .input("st", sql.Numeric, user.status)
    .input("di", sql.DateTime, user.dtInat)
    .input("cc", sql.VarChar, user.CEP_complemento)
    .query("UPDATE dbo.USUARIO SET nome=@nm, funcao=@fn, dtCriacao=@dt, urlImagem=@ui, github=@gh, linkedin=@lk, CEP=@cp, CEP_numEnd=@cn, status=@st, dtInat=@di, CEP_complemento=@cc WHERE email=@em");
    return data.recordset[0];
  }
  catch(err){
    console.log(err);
  }

}

// Create a function that inserts a new user into our Azure SQL database
async function addUser(user) {
  try{
    let pool = await sql.connect(dbConfig)
    let data = await pool.request()
    .input("em", sql.VarChar, user.email)
    .input("nm", sql.VarChar, user.nome)
    .input("fn", sql.VarChar, user.funcao)
    .input("dt", sql.DateTime, user.dtCriacao)
    .input("ui", sql.VarChar, user.urlImagem)
    .input("gh", sql.VarChar, user.github)
    .input("lk", sql.VarChar, user.linkedin)
    .input("cp", sql.VarChar(8), user.CEP)
    .input("cn", sql.Numeric, user.CEP_numEnd)
    .input("st", sql.Numeric, user.status)
    .input("di", sql.DateTime, user.dtInat)
    .input("cc", sql.VarChar, user.CEP_complemento)
    .query("INSERT INTO dbo.USUARIO (email, nome, funcao, dtCriacao, urlImagem, github, linkedin, CEP, CEP_numEnd, status, dtInat, CEP_complemento) VALUES (@em, @nm, @fn, @dt, @ui, @gh, @lk, @cp, @cn, @st, @di, @cc)");
  }
  catch(err){
    console.log(err);
  }
}


// Create a function that deletes a user
async function deleteUser(email) {
  try{
    let pool = await sql.connect(dbConfig)
    let data = await pool.request()
    .input("em", sql.VarChar, email)
    .query("DELETE FROM dbo.USUARIO WHERE email=@em");
  }
  catch (err) {
    console.log(err);
  }
} 

// Create a function that verifies if a user exists
async function userExists(email) {
  try{
    let pool = await sql.connect(dbConfig)
    let data = await pool.request()
    .input("em", sql.VarChar, email)
    .query("SELECT * FROM dbo.USUARIO WHERE email=@em");
    return data.recordset.length > 0;
  }
  catch(err){
    console.log(err);
  }
}

// A função executa a query e retorna a resposta
async function buscarUsuario(emailUsuario) {
  conn.connect()
  // Conexão OK
  .then(async function () {
    
      // Faz a requisição, passando a conexão.
      let req = new sql.Request(conn);

      // Chama os métodos do mssql de query para executá-los.
      req.query('select status FROM dbo.USUARIO WHERE email =\'' + emailUsuario + '\'')
      .then(async function (recordset) {
        conn.close();
        console.log(recordset.recordset[0].status)
        const status = await recordset.recordset[0].status;
        if (status === undefined) {
          console.log("Não tenho o cara no bd")
          return 0;
          }
          else {
            console.log("Tenho o cara no bd")
            return await status;
          }
          //console.log(recordset.recordset[0])
          // return recordset.recordset[0];
        })
        // Erros de execução da query SQL
        .catch(function (err) {
          console.log(err);
          conn.close();
        })
        
      })
      // Erros de conexão
      .catch(function (err) {
      console.log(err);
      conn.close();
    });
  }
  
  // A função executa a query e retorna a resposta
  async function atualizarImgUsuario(emailUsuario, imgUsuario) {
    conn.connect()
    // Conexão OK
    .then(function () {

      // Faz a requisição, passando a conexão.
      let req = new sql.Request(conn);
      console.log('\'' + emailUsuario)

      // query to the database and get the records
      let sql = 'UPDATE USUARIO SET urlImagem = \'' + imgUsuario + '\' WHERE email=\'' + emailUsuario + '\'';
      console.log(sql)
      req.query(sql, function (err, recordset) {
        if (err) res.send(500, 'Erro na requisição!'); //console.log(err) 
        else {
          res.send(202, 'Imagem atualizada!');
        }
      });
    })
    // Erros de conexão
    .catch(function (err) {
      console.log(err);
      conn.close();
    });
}


//Exportando métodos deste .js
module.exports = {
  buscarUsu: buscarUsuario, //O método buscarUsuario() é exportado como buscarUsu
  atualizarImgUsuario: atualizarImgUsuario,
  config: dbConfig,
  getUsers: getUsers,
  getUserByEmail: getUserByEmail,
  userExists: userExists,
  addUser: addUser,
  updateUser: updateUser,
  deleteUser: deleteUser  
};
