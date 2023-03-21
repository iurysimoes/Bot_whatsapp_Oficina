router.put("/usuarioApontamento", async (req, res) => {
  const { FUNCIONARIO_ID, ORDEM_SERVICO_FUNI_PINT_ID, OSFP_ESTAGIO } = req.body;

  let result = "";
  const token = req.headers.authorization;
  let valor = verificaToken(token);
  if (valor === true) {
    let connection;
    try {
      connection = await oracledb.getConnection(dbConfig);


      if (OSFP_ESTAGIO === null || OSFP_ESTAGIO === "LAVAGEM") {
        result = await connection.execute(
          `SELECT OS.OSFP_DT_LAVAGEM_INI, OS.OSFP_DT_LAVAGEM_FIN 
            FROM ORDEM_SERVICO_FUNI_PINT OS
            WHERE OS.ORDEM_SERVICO_FUNI_PINT_ID = :ORDEM_SERVICO_FUNI_PINT_ID `
          , [ORDEM_SERVICO_FUNI_PINT_ID]);
        if (result.rows[0].OSFP_DT_LAVAGEM_INI !== null) {
          sql = ` 
              OS.OSFP_DT_LAVAGEM_FIN = SYSDATE,
              OS.OSFP_ESTAGIO = 'POLIMENTO TECNICO'              
              `;
        } else {
          let estagioAtual = "";
          if (OSFP_ESTAGIO === null) {
            estagioAtual = " OS.OSFP_ESTAGIO = 'LAVAGEM',"
          }
          sql =
            `
              ${estagioAtual}
              OS.FUNC_LAVAGEM_ID = ${FUNCIONARIO_ID},
              OS.OSFP_DT_LAVAGEM_INI = SYSDATE
              
              `;

        }
      }
      else if (OSFP_ESTAGIO === 'POLIMENTO TECNICO') {


        result = await connection.execute(
          `SELECT OS.OSFP_DT_POLIMENTOI_INI, OS.OSFP_DT_POLIMENTOI_FIN 
            FROM ORDEM_SERVICO_FUNI_PINT OS
            WHERE OS.ORDEM_SERVICO_FUNI_PINT_ID = :ORDEM_SERVICO_FUNI_PINT_ID `
          , [ORDEM_SERVICO_FUNI_PINT_ID]);
      
        if (result.rows[0].OSFP_DT_POLIMENTOI_INI !== null) {
          sql = ` 
              OS.OSFP_DT_POLIMENTOI_FIN = SYSDATE,
              OS.OSFP_ESTAGIO = 'DESMONTAGEM'
              
              `;
        } else {

          sql = `              
              OS.FUNC_POLIMENTO_INI_ID = ${FUNCIONARIO_ID},
              OS.OSFP_DT_POLIMENTOI_INI = SYSDATE
              
              `;

        }
      }
      else if (OSFP_ESTAGIO === 'DESMONTAGEM') {


        result = await connection.execute(
          `SELECT OS.OSFP_DT_DESMONTAGEM_INI, OS.OSFP_DT_DESMONTAGEM_FIN 
           FROM ORDEM_SERVICO_FUNI_PINT OS
           WHERE OS.ORDEM_SERVICO_FUNI_PINT_ID = :ORDEM_SERVICO_FUNI_PINT_ID `
          , [ORDEM_SERVICO_FUNI_PINT_ID]);
    
        if (result.rows[0].OSFP_DT_DESMONTAGEM_INI !== null) {
          sql = ` 
             OS.OSFP_DT_DESMONTAGEM_FIN = SYSDATE,
             OS.OSFP_ESTAGIO = 'LANTERNAGEM'
             
             `;
        } else {

          sql = `              
             OS.FUNC_DESMONTAGEM_ID = ${FUNCIONARIO_ID},
             OS.OSFP_DT_DESMONTAGEM_INI = SYSDATE
             
             `;

        }
      }
      else if (OSFP_ESTAGIO === 'LANTERNAGEM') {

        result = await connection.execute(
          `SELECT OS.OSFP_DT_LANTERNAGEM_INI, OS.OSFP_DT_LANTERNAGEM_FIN 
         FROM ORDEM_SERVICO_FUNI_PINT OS
         WHERE OS.ORDEM_SERVICO_FUNI_PINT_ID = :ORDEM_SERVICO_FUNI_PINT_ID `
          , [ORDEM_SERVICO_FUNI_PINT_ID]);
     
        if (result.rows[0].OSFP_DT_LANTERNAGEM_INI !== null) {
          sql = ` 
           OS.OSFP_DT_LANTERNAGEM_FIN = SYSDATE,
           OS.OSFP_ESTAGIO = 'PREPARACAO'
           
           `;
        } else {

          sql = `              
           OS.FUNC_LANTERNAGEM_ID = ${FUNCIONARIO_ID},
           OS.OSFP_DT_LANTERNAGEM_INI = SYSDATE
           
           `;

        }
      }
      else if (OSFP_ESTAGIO === 'PREPARACAO') {

        result = await connection.execute(
          `SELECT OS.OSFP_DT_PREPARACAO_INI, OS.OSFP_DT_PREPARACAO_FIN 
         FROM ORDEM_SERVICO_FUNI_PINT OS
         WHERE OS.ORDEM_SERVICO_FUNI_PINT_ID = :ORDEM_SERVICO_FUNI_PINT_ID `
          , [ORDEM_SERVICO_FUNI_PINT_ID]);
        console.log(result.rows)
        if (result.rows[0].OSFP_DT_PREPARACAO_INI !== null) {
          sql = ` 
           OS.OSFP_DT_PREPARACAO_FIN = SYSDATE,
           OS.OSFP_ESTAGIO = 'PINTURA'
           
           `;
        } else {

          sql = `              
           OS.FUNC_PREPARACAO_ID = ${FUNCIONARIO_ID},
           OS.OSFP_DT_PREPARACAO_INI = SYSDATE
           
           `;

        }
      }
      else if (OSFP_ESTAGIO === 'PINTURA') {

        result = await connection.execute(
          `SELECT OS.OSFP_DT_PINTURA_INI, OS.OSFP_DT_PINTURA_FIN 
         FROM ORDEM_SERVICO_FUNI_PINT OS
         WHERE OS.ORDEM_SERVICO_FUNI_PINT_ID = :ORDEM_SERVICO_FUNI_PINT_ID `
          , [ORDEM_SERVICO_FUNI_PINT_ID]);
        console.log(result.rows)
        if (result.rows[0].OSFP_DT_PINTURA_INI !== null) {
          sql = ` 
           OS.OSFP_DT_PINTURA_FIN = SYSDATE,
           OS.OSFP_ESTAGIO = 'MONTAGEM'
           
           `;
        } else {

          sql = `              
           OS.FUNC_PINTURA_ID = ${FUNCIONARIO_ID},
           OS.OSFP_DT_PINTURA_INI = SYSDATE
           
           `;

        }
      }
      else if (OSFP_ESTAGIO === 'MONTAGEM') {

        result = await connection.execute(
          `SELECT OS.OSFP_DT_MONTAGEM_INI, OS.OSFP_DT_MONTAGEM_FIN 
         FROM ORDEM_SERVICO_FUNI_PINT OS
         WHERE OS.ORDEM_SERVICO_FUNI_PINT_ID = :ORDEM_SERVICO_FUNI_PINT_ID `
          , [ORDEM_SERVICO_FUNI_PINT_ID]);
        console.log(result.rows)
        if (result.rows[0].OSFP_DT_MONTAGEM_INI !== null) {
          sql = ` 
           OS.OSFP_DT_MONTAGEM_FIN = SYSDATE,
           OS.OSFP_ESTAGIO = 'POLIMENTO FINAL'
           
           `;
        } else {

          sql = `              
           OS.FUNC_MONTAGEM_ID = ${FUNCIONARIO_ID},
           OS.OSFP_DT_MONTAGEM_INI = SYSDATE
           
           `;

        }
      }


      else if (OSFP_ESTAGIO === 'POLIMENTO FINAL') {

        result = await connection.execute(
          `SELECT OS.OSFP_DT_POLIMENTOF_INI, OS.OSFP_DT_POLIMENTOF_FIN 
         FROM ORDEM_SERVICO_FUNI_PINT OS
         WHERE OS.ORDEM_SERVICO_FUNI_PINT_ID = :ORDEM_SERVICO_FUNI_PINT_ID `
          , [ORDEM_SERVICO_FUNI_PINT_ID]);
        console.log(result.rows)
        if (result.rows[0].OSFP_DT_POLIMENTOF_INI !== null) {
          sql = ` 
           OS.OSFP_DT_POLIMENTOF_FIN = SYSDATE,
           OS.OSFP_ESTAGIO = 'FINALIZADA'
           
           `;
        } else {

          sql = `              
           OS.FUNC_POLIMENTO_FIN_ID = ${FUNCIONARIO_ID},
           OS.OSFP_DT_POLIMENTOF_INI = SYSDATE
           
           `;

        }
      }

      await connection.execute(
        ` 
          UPDATE ORDEM_SERVICO_FUNI_PINT OS SET
          ${sql}  
          WHERE OS.ORDEM_SERVICO_FUNI_PINT_ID = :ORDEM_SERVICO_FUNI_PINT_ID    
          `
        , [ORDEM_SERVICO_FUNI_PINT_ID])

      res.status(200).send("Apontamento da " + (OSFP_ESTAGIO ? OSFP_ESTAGIO : "LAVAGEM") + "  feito com sucessO")

      connection.commit();
    } catch (error) {
      connection.rollback();
      console.error(error);
      return res.status(500).send("Erro ao tentar fazer Apontamento" + error.message).end();
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (error) {
          console.error(error);
        }
      }
    }

  } else {
    return res.status(511).send(`Sessão expirada !\nFavor fazer um novo login!`).end();

  }

});

//////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
///inicio rascunho 


const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');
const qrcode = require('qrcode-terminal');
const oracledb = require("oracledb");
const dbConfig = require('./src/ConfigDB');

// Caminho onde os dados da sessão serão armazenados
const SESSION_FILE_PATH = './session.json';

const valorBR = (data) => {
  if (data) return data.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
}
// Carregando os dados da sessão se tiverem sido salvos anteriormente em session.json
let sessionData;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionData = require(SESSION_FILE_PATH);

}

//  Usand  os valores salvos em session.json
const client = new Client({
  authStrategy: new LocalAuth({
    session: sessionData
  })
});
//aqui é meu codigo qrcode..
client.on('qr', (qr) => {
  //console.log('QR RECEIVED', qr);
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {

  console.log('Conectado com sucesso!');
  client.getChats().then(chats => {

   // console.log(ID_GRUPO_WPP);
    // client.sendMessage(mygroup.id._serialized, "ollá envio de testes" )  ;
    //let testeiury = 'teste iury!';

    
    const conex = async (req, res) => {

      let connection;
      
      try {
        console.log("aqui");
        connection = await oracledb.getConnection(dbConfig);
       
       let result = await connection.execute(
          `
               SELECT UF.UNFE_SIGLA                                                UNFE_SIGLA,
                      SUM(IPD.ITPD_PRECO_LIQUIDO_TOTAL)                            VALOR_SEG,
                      SUBSTR(to_char(CT.COTA_DT_FIM,'dd/mm/yyyy hh24:mi'),1,16)    COTA_DT_INICIO,
                      PD.PEDI_NUM_PEDIDO                                           PEDI_NUM_PEDIDO,
                      CT.COTA_NUM_SINISTRO ||'-'|| SG.SGRA_NOME_FANTASIA           SINISTRO,
                      CT.ID_COTACAO                                                ID_COTACAO,
                      GP.ID_DESC_GRUPO                                             ID_GRUPO_WPP,
                      FR.ID_FORNECEDOR                                             ID_FORNECEDOR
       
                 FROM COTACAO CT,
                      PEDIDO PD,
                      ITEM_PEDIDO IPD,
                      SEGURADORA SG,
                      FORNECEDOR FR,
                      UNIDADE_FEDERATIVA UF,
                      GRUPO_WPP  GP
                WHERE CT.ID_COTACAO = PD.ID_COTACAO
                  AND IPD.ID_PEDIDO = PD.ID_PEDIDO
                  AND SG.ID_SEGURADORA = CT.ID_SEGURADORA
                  AND FR.ID_FORNECEDOR = PD.ID_FORNECEDOR
                  AND FR.ID_UNIDADE_FEDERATIVA = UF.ID_UNIDADE_FEDERATIVA
                  AND CT.COTA_STATUS = 'Liberada'
                  AND CT.COTA_ENV_WPP IS NULL
                  /*and  CT.ID_COTACAO = 549*/
                  AND FR.ID_GRUPO_WPP IS NOT NULL
                  AND GP.ID_GRUPO_WPP  = FR.ID_GRUPO_WPP
                                  
                group by UF.UNFE_SIGLA,
                         /*IPD.ITPD_PRECO_BRUTO_SEGURADORA,*/
                         CT.COTA_DT_FIM,
                         PD.PEDI_NUM_PEDIDO,
                         CT.COTA_NUM_SINISTRO ||'-'|| SG.SGRA_NOME_FANTASIA,
                         CT.ID_COTACAO,
                         GP.ID_DESC_GRUPO,
                         FR.ID_FORNECEDOR
                 
               `,
          [],
          { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        //if (result.rows.count > 0) {
         
          let ESTADO_COT = result.rows[0].UNFE_SIGLA; //ESTADO REGIAO COTACAO
          let VALORTOTAL = result.rows[0].VALOR_SEG; //VALOR TOTAL
          let HORARIO_COT_INI = result.rows[0].COTA_DT_INICIO; //HORARIOS INICIAL COTACAO
          let NR_PEDIDO = result.rows[0].PEDI_NUM_PEDIDO; //NUMERO DO PEDIDO DA COTACAO
          let NR_SINISTRO = result.rows[0].SINISTRO; //NUMERO DO PEDIDO DA COTACAO
          let ID_COTACAO = result.rows[0].ID_COTACAO; //ID DA COTACAO
          

          const mygroup = chats.find(
            (chats) => chats.name === result.rows[0].ID_GRUPO_WPP //"Avvante" // :ID_GRUPO_COTACAO  // passar parametro para ver de qual grupo fornecedor pertence antes de enviar 
          );
          let valores = ` Estado : ${ESTADO_COT} \n Valor Total : ${valorBR(VALORTOTAL)} \n Encerramento : ${HORARIO_COT_INI} hs  \n Nr Pedido : ${NR_PEDIDO} \n Sinistro : ${NR_SINISTRO}`;
          // ${} serve para concatenar as variaveis.

          if (conex) {
            // client.sendMessage(mygroup.id._serialized, verificados);
            client.sendMessage(mygroup.id._serialized, valores);
            await connection.execute(`UPDATE COTACAO CT
                                             SET CT.COTA_ENV_WPP = 'Sim'
                                           WHERE CT.ID_COTACAO   = :ID_COTACAO
                                         `,
              [ID_COTACAO], { autoCommit: true }

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
    };
    setInterval(async function () {
      console.log('Isto aqui vai ser executado a cada 5 segundos');
      conex();
    }, 5 * 1 * 1000); // 5*10*1000 = 300.000, o que corresponde a 5 minutos
    conex();

    /*iury fim*/

    client.on('message', message => {
      console.log(message.body);
     // console.log(chats);
      // aqui é listado tudo do grupo filtrado acima
    });

  })
});


// Salvando os valores da sessão no arquivo após a autenticação bem-sucedida
//abaixo client.on era  authenticated  e mudei para numero 2020  
client.on('2020', (session) => {
  sessionData = session;
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {

    if (err) {
      console.error(err);
    }
  });
});


client.initialize();





//function getStage(user){
//  return banco.user1.stage;
  
