//Fonte: https://learn.microsoft.com/pt-br/azure/azure-sql/database/connect-query-nodejs?view=azuresql&tabs=windows

const { Connection, Request } = require("tedious");

//Criando conexão com o Azure SQL
const config = {
    authentication: {
        options: {
            userName: "Db3xmanager",
            password: "3X_PCS_EEMTV_1024"
        },
        type: "default"
    },
    server: "serverdb3x.database.windows.net",
    options: {
        database: "BD3X",
        encrypt: true
    }
};

//TENTANDO CONECTAR
const connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on("connect", err => {
  if (err) {
    console.error(err.message);
  } else {
    console.log(validarUsuario('edusantos@edu.unirio.br'));
  }
});

connection.connect();

function queryDatabase() {
  console.log("Lendo tabela usuario...");

  // Read all rows from table
  const request = new Request(
    `SELECT *
     FROM [dbo].[USUARIO]`,
    (err, rowCount) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log(`${rowCount} row(s) returned`);
      }
    }
  );

  request.on("row", columns => {
    columns.forEach(column => {
      console.log("%s\t%s", column.metadata.colName, column.value);
    });
  });

  connection.execSql(request);
}

function validarUsuario(emailUsuario) {
  // Read all rows from table
  const request = new Request(
    `SELECT status FROM USUARIO WHERE email = '${emailUsuario}'`,
    (err, rowCount) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log(`${rowCount} row(s) returned`);
      }
    }
  );

  request.on("row", columns => {
    columns.forEach(column => {
        console.log("Está no BD: " + (column.value !== 5))
        return column.value !== 5;
        
      //console.log("%s\t%s", column.metadata.colName, column.value);
    });
  });

  connection.execSql(request);
}