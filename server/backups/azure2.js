let Connection = require('tedious').Connection;

let config = {
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

let connection = new Connection(config);

connection.on('connect', function(err) {
  // If no error, then good to go...
    executeStatement();
  }
);

let Request = require('tedious').Request;

function executeStatement() {
  let request = new Request(`select status FROM USUARIO WHERE email ='${emailUsuario}' FOR JSON PATH'`, function(err, rowCount) {
    if (err) {
      console.log(err);
    } else {
      console.log(rowCount + ' rows');
    }
  });

  request.on('row', function(columns) {
    columns.forEach(function(column) {
      console.log(column.value);
    });
  });
  connection.execSql(request);
}