const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
import qrcodeTerminal from "qrcode-terminal";
import { image as imageQr } from "qr-image";
import fs from "fs";
import path from "path";

let status = false;
let qrCode = "";

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

client.initialize();

client.on("loading_screen", (percent, message) => {
  console.log("LOADING SCREEN", percent, message);
});

client.on("qr", (qr) => {
  //qrcodeTerminal.generate(qr, { small: true }); // Genera el QR en la consola
  //console.log("Scan the QR code above to log in."); // Instrucciones para el usuario
  getQRBase64(qr);
});

client.on("authenticated", () => {
  console.log("AUTHENTICATED");
});

client.on("auth_failure", (msg) => {
  // Fired if session restore was unsuccessful
  console.error("AUTHENTICATION FAILURE", msg);
});

client.on("ready", () => {
  status = true;
  console.log("READY");
});

function getQRBase64(qrString) {
  if (!qrString) {
    return null;
  }

  const path = `${process.cwd()}/tmp`; // Ruta donde se guardará la imagen QR
  let qr_svg = imageQr(qrString, { type: "png", margin: 4 });
  // Convierte la imagen QR a una cadena Base64
  const chunks = [];
  qr_svg.on("data", (chunk) => chunks.push(chunk));
  qr_svg.on("end", () => {
    const qrCodeBase64 = Buffer.concat(chunks).toString("base64");
    qrCode = qrCodeBase64;
  });

  qr_svg.pipe(require("fs").createWriteStream(`${path}/qr.png`));
  console.log(`⚡ Recuerda que el QR se actualiza cada minuto ⚡'`);
  console.log(`⚡ Actualiza F5 el navegador para mantener el mejor QR⚡`);
}

module.exports = (app) => {
  const apiToken = process.env.API_TOKEN;
  // const Chats = app.db.models.Chats;
  // const Messages = app.db.models.Messages;

  const htmlBody = `
  <div style="text-align: center;">
  <h1>ERROR 404</h1>
  <br>
  <img src="http://i.stack.imgur.com/SBv4T.gif" alt="I choose you!"  width="250" />
  <br>
  <h1>Page not found</h1>
  </div>
  `;

  app.get("/", (req, res) => {
    res.status(404).send(htmlBody);
    //res.json({message: "EndPoint API"})
  });

  app.route("/api").get((req, res) => {
    res.status(404).send(htmlBody);
    //res.json({message: "EndPoint API"})
  });

  // Mensaje solo txt
  app.post("/api/message", async (req, res) => {
    //res.status(200).send();
    //console.log("BODY DEL MENSAJE A ENVIAR");
    //console.log(req.body);
    const { message, phone } = req.body;

    // Si el numero no esta registrado en WA no se envia el mensaje y retorna el nro
    if (!(await client.getNumberId(phone.toString()))) {
      console.log({ unknow: phone });
      res.json({ unknow: phone });
      return;
    }

    const response = await client.sendMessage(`${phone}@c.us`, message);

    console.log({ id: response.id.id, chat_id: response.id.remote._serialized });
    res.json({ id: response.id.id, chat_id: response.id.remote._serialized });
  });

  // Mensaje con archivo adjunto
  app.post("/lead", async (req, res) => {
    //res.status(200).send();
    //console.log("BODY DEL MENSAJE CON ARCHIVO A ENVIAR");
    //console.log(req.body);
    const { message, phone, mimeType, data } = req.body;

    const media = new MessageMedia(mimeType, data, null, null);

    // Si el numero no esta registrado en WA no se envia el mensaje y retorna el nro
    if (!(await client.getNumberId(phone.toString()))) {
      console.log({ unknow: phone });
      res.json({ unknow: phone });
      return;
    }

    const response = await client.sendMessage(`${phone}@c.us`, message, { media: media });

    console.log({ id: response.id.id, chat_id: response.id.remote._serialized });
    res.json({ id: response.id.id, chat_id: response.id.remote._serialized });
  });

  // Get status
  app.get("/lead/status", async (req, res) => {
    //res.status(200).send();
    //console.log(req.body);

    if (!status) {
      res.json({
        myStatus: status,
        QR: qrCode,
      });
    } else {
      //console.log(client);
      res.json({
        myStatus: status,
        name: client.info.pushname,
        number: client.info.wid.user,
      });
    }
  });
};
