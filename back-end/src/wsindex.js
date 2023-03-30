const { Client, LocalAuth,Buttons,List, MessageMedia } = require("whatsapp-web.js");
const fs = require("fs");
const qrcode = require("qrcode-terminal");
const oracledb = require("oracledb");
const { measureMemory } = require("vm");
//const banco = require('./banco');
//const stages = require ('./stages');
const dbConfig = require("./ConfigDB");
const { AQ_DEQ_WAIT_FOREVER } = require("oracledb");
const getusuario = require("./stages/usuario");
const getmenu = require("./stages/menu");
const getmenuEstagio = require("./stages/estagioMenu");
const stageLavagem = require("./stages/lavagem");
const stagePolimentoTecnico = require("./stages/polimentoTecnico");
const stageDesmontagem = require("./stages/desmontagem");
const stageLanternagem = require("./stages/lanternagem");
const stagePreparacao = require("./stages/preparacao");
const stagePintura = require("./stages/pintura");
const stageMontagem = require("./stages/montagem");
const stagePolimentoFinal = require("./stages/polimentoFinal");


// Caminho onde os dados da sessão serão armazenados
const SESSION_FILE_PATH = "./session.json";

const valorBR = (data) => {
  if (data)
    return data.toLocaleString("pt-br", { style: "currency", currency: "BRL" });
};
// Carregando os dados da sessão se tiverem sido salvos anteriormente em session.json
let sessionData;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionData = require(SESSION_FILE_PATH);
}

//  Usand  os valores salvos em session.json
const client = new Client({
  authStrategy: new LocalAuth({
    session: sessionData,
  }),
});
//aqui é meu codigo qrcode..
client.on("qr", (qr) => {
  //console.log('QR RECEIVED', qr);
  qrcode.generate(qr, { small: true });
});
let reinicioMenu = true;
let menuIniciado;
let menuEstagio = null;
let menuEstagioIniciado;
let passaEstagioOs;
let menu = null;
let usuario;
let usuarioIniciado;
let numeroOsIniciado;
let numeroOS;
//let testebotao = "teste 1";
client.on("ready", () => {
  console.log("Conectado com sucesso!");
  //client.getChats().then(chats => {
  ////iury inicioc
  
  client.on("message", (message) => {
    //client.sendMessage(message.from,FormattedButtonSpec.testebotao);
    if (( message.body ==="Menu") && (reinicioMenu === true)) {
      client.sendMessage(
        message.from,
        "Olá sou assistente Virtual\n\n 1⃣-Iniciar Apontamento \n 2⃣-Finalizar Apontamento "
      );
     
        //  console.log(message.body, "mss" );
        //  let button = new Buttons('Button body',[{body:'bt1'},{body:'bt2'},{body:'bt3'}],'title','footer');
        // client.sendMessage(message.from, button);
        //  console.log("auqi")
        //  console.log(button);
        
       
      menuIniciado = true;
    }

    if (menuIniciado === true) {
      if (message.body === "1") {
        menu = "1";
      }
      if (message.body === "2") {
        menu = "2";
      }
    }
    if (menu !== null) {
      getmenu(menu).then((retmenu) => {
        if (retmenu === true) {
          client.sendMessage(message.from, "Informe seu Usuario.");
          menu = null;
          usuarioIniciado = true;
          menuIniciado = false;
        }
      });
    }
    if (usuarioIniciado === true) {
      usuario = message.body;

      try {
        getusuario(usuario).then((retorno) => {
          if (retorno === true) {
            //client.sendMessage(message.from, "Informe numero da OS");
            client.sendMessage(
              message.from,
              "Deseja efetuar apontamento para qual função? \n" +
                "1⃣-LAVAGEM\n" +
                "2⃣-POLIMENTO TECNICO\n" +
                "3⃣-DESMONTAGEM\n" +
                "4⃣-LANTERNAGEM\n" +
                "5⃣-PREPARACAO\n" +
                "6⃣-PINTURA\n" +
                "7⃣-MONTAGEM\n" +
                "8⃣-POLIMENTO FINAL\n"
            );

            usuarioIniciado = false;
            //numeroOsIniciado = true;
            menuEstagioIniciado = true;
          }
        });
      } catch (error) {
        console.error(error);
      }
    }

    if (menuEstagioIniciado === true) {
      if (message.body === "1") {
        menuEstagio = "1";
        menuEstagioIniciado = false;
      }
      if (message.body === "2") {
        menuEstagio = "2";
        menuEstagioIniciado = false;
      }
      if (message.body === "3") {
        menuEstagio = "3";
        menuEstagioIniciado = false;
      }
      if (message.body === "4") {
        menuEstagio = "4";
        menuEstagioIniciado = false;
      }
      if (message.body === "5") {
        menuEstagio = "5";
        menuEstagioIniciado = false;
      }
      if (message.body === "6") {
        menuEstagio = "6";
        menuEstagioIniciado = false;
      }
      if (message.body === "7") {
        menuEstagio = "8";
        menuEstagioIniciado = false;
      }
      if (message.body === "8") {
        menuEstagio = "8";
        menuEstagioIniciado = false;
      }
    }
    if (menuEstagio !== null) {
      getmenuEstagio(menuEstagio)
        .then((retmenuEstagio) => {
          client.sendMessage(message.from, "Informe o Numero da OS.");
          menuEstagio = null;
          usuarioIniciado = false;
          numeroOsIniciado = true;
          passaEstagioOs = retmenuEstagio;
        })
        .catch((erro) => {
          console.log(erro);
        });
    }
    if (passaEstagioOs === "LAVAGEM") {
      if (numeroOsIniciado === true) {
        numeroOS = message.body;
        try {
          stageLavagem(numeroOS).then((retornoOs) => {
            if (retornoOs === true) {
              client.sendMessage(
                message.from,
                "Apotamento Lavagem efetuado com Sucesso!"
              );
              numeroOS = null;
              reinicioMenu = true;
              passaEstagioOs = null;
            }
          });
        } catch (error) {
          console.error(error);
        }
      }
    } else if (passaEstagioOs === "POLIMENTO TECNICO") {
      if (numeroOsIniciado === true) {
        numeroOS = message.body;
        try {
          stagePolimentoTecnico(numeroOS).then((retornoOs) => {
            if (retornoOs === true) {
              client.sendMessage(
                message.from,
                "Apotamento polimento tecnico efetuado com Sucesso!"
              );
              numeroOS = null;
              reinicioMenu = true;
              passaEstagioOs = null;
              numeroOsIniciado = false;
            }
          });
        } catch (error) {
          console.error(error);
        }
      }
    } else if (passaEstagioOs === "DESMONTAGEM") {
      if (numeroOsIniciado === true) {
        numeroOS = message.body;
        try {
          stageDesmontagem(numeroOS).then((retornoOs) => {
            if (retornoOs === true) {
              client.sendMessage(
                message.from,
                "Apotamento desmontagem efetuado com Sucesso!"
              );
              numeroOS = null;
              reinicioMenu = true;
              passaEstagioOs = null;
            }
          });
        } catch (error) {
          console.error(error);
        }
      }
    } else if (passaEstagioOs === "LANTERNAGEM") {
      if (numeroOsIniciado === true) {
        numeroOS = message.body;
        try {
          stageLanternagem(numeroOS).then((retornoOs) => {
            if (retornoOs === true) {
              client.sendMessage(
                message.from,
                "Apotamento lanternagem efetuado com Sucesso!"
              );
              numeroOS = null;
              reinicioMenu = true;
              passaEstagioOs = null;
            }
          });
        } catch (error) {
          console.error(error);
        }
      }
    } else if (passaEstagioOs === "PREPARACAO") {
      if (numeroOsIniciado === true) {
        numeroOS = message.body;
        try {
          stagePreparacao(numeroOS).then((retornoOs) => {
            if (retornoOs === true) {
              client.sendMessage(
                message.from,
                "Apotamento preparação efetuado com Sucesso!"
              );
              numeroOS = null;
              reinicioMenu = true;
              passaEstagioOs = null;
            }
          });
        } catch (error) {
          console.error(error);
        }
      }
    } else if (passaEstagioOs === "PINTURA") {
      if (numeroOsIniciado === true) {
        numeroOS = message.body;
        try {
          stagePintura(numeroOS).then((retornoOs) => {
            if (retornoOs === true) {
              client.sendMessage(
                message.from,
                "Apotamento Pintura efetuado com Sucesso!"
              );
              numeroOS = null;
              reinicioMenu = true;
              passaEstagioOs = null;
            }
          });
        } catch (error) {
          console.error(error);
        }
      }
    } else if (passaEstagioOs === "MONTAGEM") {
      if (numeroOsIniciado === true) {
        numeroOS = message.body;
        try {
          stageMontagem(numeroOS).then((retornoOs) => {
            if (retornoOs === true) {
              client.sendMessage(
                message.from,
                "Apotamento Montagem efetuado com Sucesso!"
              );
              numeroOS = null;
              reinicioMenu = true;
              passaEstagioOs = null;
            }
          });
        } catch (error) {
          console.error(error);
        }
      }
    } else if (passaEstagioOs === "POLIMENTO FINAL") {
      if (numeroOsIniciado === true) {
        numeroOS = message.body;
        try {
          stagePolimentoFinal(numeroOS).then((retornoOs) => {
            if (retornoOs === true) {
              client.sendMessage(
                message.from,
                "Apotamento polimento final efetuado com Sucesso!"
              );
              numeroOS = null;
              reinicioMenu = true;
              passaEstagioOs = null;
            }
          });
        } catch (error) {
          console.error(error);
        }
      }
    }
  });
});
////iury fin

// Salvando os valores da sessão no arquivo após a autenticação bem-sucedida
//abaixo client.on era  authenticated  e mudei para numero 2020
client.on("2020", (session) => {
  sessionData = session;
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
    if (err) {
      console.error(err);
    }
  });
});

client.initialize();
//556285119035@c.us
