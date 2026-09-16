import express from "express";
import dotenv from "dotenv";
import notifier from "node-notifier"
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = Number(process.env.PORT);
if(!PORT) throw Error("Porta não definida no arquivo .env");

function notifcacao(title, message){
        notifier.notify({
            title,
            message,
            icon:  path.join(__dirname, 'images/icons-notificacao.png'),
            sound: true,
            duration: 5,
        })
}

app.use(express.json());

app.post("/notification", (req, res) => {
    const githubEvent = req.headers['x-github-event'];
    console.log(`Evento recebido: ${githubEvent}`);
    if(githubEvent === 'ping'){
        const title = "PING servidor";
        const message = "Conexão estabelecida com sucesso!";
        notifcacao(title, message);
        return res.status(201).send('Pong!');
    }else{
        const repoName = req.body.repository?.name ?? "None";
        const title = `Evento no repositorio ${repoName}`;
        const message = `Evento de ${githubEvent} no repositorio ${repoName}`;
        notifcacao(title, message);
    }
    return res.status(201).json({message: "Sucess!"});
})

app.listen(PORT, () =>{
    console.log(`Rodando na porta ${PORT}`);
})
