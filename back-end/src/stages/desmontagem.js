const oracledb = require("oracledb");
const dbConfig = require("../ConfigDB");

const stageDesmontagem = async (numeroOS) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    let result = await connection.execute(
      `SELECT OS.OSFP_DT_DESMONTAGEM_INI, OS.OSFP_DT_DESMONTAGEM_FIN ,
                     OS.ORDEM_SERVICO_FUNI_PINT_ID, OS.FUNC_LAVAGEM_ID  
                       FROM ORDEM_SERVICO_FUNI_PINT OS
                      WHERE OS.ORDEM_SERVICO_FUNI_PINT_ID = :numeroOS
                    `,
      [numeroOS],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    // }
    let ID_COTACAO = result.rows[0].ORDEM_SERVICO_FUNI_PINT_ID;
    console.log(ID_COTACAO,"ID COTACAO SENDO PASSADO");
    if (result.rows[0].OSFP_DT_DESMONTAGEM_INI !== null) {
      await connection.execute(
        `UPDATE ORDEM_SERVICO_FUNI_PINT OS
                       SET OS.OSFP_DT_DESMONTAGEM_FIN = SYSDATE,
                           OS.OSFP_ESTAGIO     = 'LANTERNAGEM'
                           
                     WHERE OS.ORDEM_SERVICO_FUNI_PINT_ID =  :ID_COTACAO     
                      `,
        //[FUNCIONARIO_ID],
        [ID_COTACAO],
        { autoCommit: true }
      );
      
    } else if (result.rows[0].OSFP_DT_DESMONTAGEM_INI === null) {
      await connection.execute(
        `UPDATE ORDEM_SERVICO_FUNI_PINT OS
                        SET OS.OSFP_DT_DESMONTAGEM_INI = SYSDATE,
                            OS.OSFP_ESTAGIO     = 'DESMONTAGEM'
                            
                      WHERE OS.ORDEM_SERVICO_FUNI_PINT_ID =  :ID_COTACAO     
                       `,
        //[FUNCIONARIO_ID],
        [ID_COTACAO],
        { autoCommit: true }
      );
    }

    //}
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

module.exports = stageDesmontagem;
