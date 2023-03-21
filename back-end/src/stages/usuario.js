const oracledb = require("oracledb");
const dbConfig = require("../ConfigDB");


 
const getusuario = async (USUARIO_OS) => {
  let connection;

  try {
    console.log("aqui conex1");

    connection = await oracledb.getConnection(dbConfig);

    let result = await connection.execute(
      `
            SELECT USRO.USRO_USUARIO,USRO.USUARIO_ID
              FROM USUARIO USRO , FUNC_USRO FUNC, FUNCAO F
             WHERE USRO.USUARIO_ID = FUNC.USUARIO_ID
               AND F.FUNCAO_ID    = FUNC.FUNCAO_ID
               AND F.FUNCAO_DESCRICAO = 'LAVADOR'
               AND USRO.USRO_FUNCIONARIO = 'Sim'
               AND USRO.USRO_USUARIO = :USUARIO_OS
                 `,
      [USUARIO_OS],
      //[],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // if (result.rows[0].USRO_USUARIO !== null) {
    //   console.log("retornou usuario corretamente");
    
    // }
  } catch (error) {
    console.error(error);
    //    res.send(error.message).status(500);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error(error);
      }
    }
  }
  return true;
};



module.exports = getusuario;
