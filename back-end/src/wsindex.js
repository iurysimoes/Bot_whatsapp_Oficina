const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const fs = require("fs");
const qrcode = require("qrcode-terminal");
const oracledb = require("oracledb");

const { measureMemory } = require("vm");
//const banco = require('./banco');
//const stages = require ('./stages');
const dbConfig = require("./ConfigDB");
const { AQ_DEQ_WAIT_FOREVER } = require("oracledb");

const getusuario = require("./stages/usuario");
const ordemServico = require("./stages/ordemServico");
const getmenu = require("./stages/menu");

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
let menuIniciado;
let menu;
let usuario;
let usuarioIniciado;
let numeroOsIniciado;
let numeroOS;
client.on("ready", () => {
  console.log("Conectado com sucesso!");
  //client.getChats().then(chats => {
  ////iury inicio

  client.on("message", (message) => {
    if (message.body === "Ola") {
      client.sendMessage(
        message.from,
        "Olá sou assistente Virtual\n\n 1-Iniciar Apontamento \n 2-Finalizar Apontamento "
      );
      menuIniciado = true;
    }

    //});
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
        }
      });
    }
    if (usuarioIniciado === true) {
      usuario = message.body;

      try {
        getusuario(usuario).then((retorno) => {
          if (retorno === true) {
            client.sendMessage(message.from, "Informe numero da OS");
            usuarioIniciado = false;
            numeroOsIniciado = true;
          }
        });
      } catch (error) {
        console.error(error);
      }
    }
    if (numeroOsIniciado === true) {
      numeroOS = message.body;
      try {
        ordemServico(numeroOS).then((retornoOs) => {
          if (retornoOs === true) {
            client.sendMessage(
              message.from,
              "Apotamento Iniciado com Sucesso!"
            );
          }
        });
      } catch (error) {
        console.error(error);
      }
    }
  });
});
////iury fin

// client.on("message", message => {
//   if (message.body === "Ola") {

//     client.sendMessage(
//       message.from,
//       "Olá sou assistente Virtual\n\n 1-Iniciar Apontamento \n 2-Finalizar Apontamento "
//     );
//   }
//   else {
//     console.log(message.body);
//     if ((message.body === "1") && (message.body !== "Ola")) {
//       client.sendMessage(message.from, "Informe seu usuario.");

//     }

//   };
//   if ((message.body !== "1") && (message.body !== "Ola") && (message.body === "gerente")) {
//     let USUARIO_OS = message.body;

//     console.log(USUARIO_OS, "PASSANDO USUARIO");
//     if (USUARIO_OS !== null) {
//       try {
//         getusuario(USUARIO_OS)
//           .then((retorno) => {
//             if (retorno === true) {
//               client.sendMessage(message.from, "Informe numero da OS.");

//             }
//           });
//       } catch (error) {
//         console.error(error);
//       }

//     };

//   };

//      let NR_OS = message.body;
//      console.log(NR_OS,"passou numero os");
//      console.log(USUARIO_OS, "variavel usuario");
//      if ((USUARIO_OS !== null)) {
//       try {
//         ordemServico(NR_OS)
//         .then((retornoOs) => {
//           if (retornoOs === true) {
//              client.sendMessage(message.from, "Apotamento Iniciado com Sucesso!");

//           }
//         });
//       } catch (error) {
//         console.error(error);
//       }
//     };

//   });

// });

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
