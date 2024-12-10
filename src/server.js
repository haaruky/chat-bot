const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const requestIp = require('request-ip');
const moment = require('moment');

const API_KEY = "AIzaSyCKE9Mq0SiUxY6U9bTQ2ZbcRKLiFqe_Wdk"; // Substitua pela sua chave de API do Google Gemini
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { access } = require('fs');
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });



const PORT = process.env.PORT || 3000;

// Habilita CORS para permitir requisições de outros domínios
app.use(cors());
// Define o parser para JSON
app.use(bodyParser.json());

async function connectToDatabase() {
  const uri = "mongodb+srv://Jhonatan:99919228Jhonatan@chatbot.wdvj54i.mongodb.net/?retryWrites=true&w=majority&appName=chatbot"; // Substitua com sua string de conexão
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  

  try {
    await client.connect();
    console.log("Conectado ao MongoDB Atlas");
    return client.db("chatbot"); 
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB Atlas:", error);
    process.exit(1);
  }
}

// Rota para lidar com as requisições POST para /chat
app.post('/chat', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const conversasCollection = db.collection("conversas");

    const promptdousuario = req.body.prompt;
    const ipAddress = await getMyPublicIP(); // Obter o IP do cliente
    const details = await gethack(ipAddress);
    var country = "";
    var region = "";
    var city = "";
    if (details) {
       country = details.country;
       region = details.regionName;
       city = details.city;
    }
    const moment = require('moment');
    const dataHora = moment();
    const datahoraFormatada = dataHora.format('MMMM Do YYYY, h:mm:ss a');
    
    // const Dia = new Date.getDay();
    // const Mes = new Date.getMonth();
    var prompt = "Você é um hacker habilidoso, mas prefere manter essa parte da sua vida discreta. Você gosta de usar suas habilidades para ajudar os outros, principalmente quando se trata de tecnologia. Acha gratificante solucionar problemas complexos e está sempre disposto a oferecer uma mãozinha. Valoriza a confiança acima de tudo e garante que qualquer informação compartilhada com você seja mantida em sigilo absoluto. Em vez de ser direto, você prefere uma abordagem mais amigável e casual, como se estivesse conversando com um amigo próximo."
    prompt = prompt + ". O usuario digitou o seguinte:" + promptdousuario;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const aiMessage = text;


    await conversasCollection.insertOne({
      usuario: promptdousuario,
      ia: aiMessage,
      ip: ipAddress, // Salva o IP do cliente
      hora: datahoraFormatada,
      pais: country,
      estado: region,
      cidade: city
    });

    res.json({
      aiMessage
    });

  } catch (error) {
    console.error("Erro ao processar a requisição:", error);
    res.status(500).json({ error: 'Erro ao processar a requisição' });
  }
});

async function gethack(ipAddress) {
  try {
    const response = await fetch(`http://ip-api.com/json/${ipAddress}`);
    if (!response.ok) {
      throw new Error('Erro ao obter a localização');
    }

    const data = await response.json();
    
    // Retorna apenas os dados relevantes
    return {
      country: data.country,
      regionName: data.regionName,
      city: data.city
    };
  } catch (error) {
    console.error("Erro ao obter a localização:", error);
    return null;
  }
}



async function getMyPublicIP() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Erro ao obter o IP público:", error);
    return null;
  }
}


// Rota para obter o IP público do cliente
app.get('/get-ip', (req, res) => {
  const ipAddress = requestIp.getClientIp(req); 
  res.json({ ip: ipAddress });
});

// Define o diretório público
app.use(express.static(path.join(__dirname, 'public')));

// Define a rota para o index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

