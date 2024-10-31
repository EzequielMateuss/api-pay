import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;
const FLYPAYMENTS_API_URL = 'https://api.sistema.flypayments.com.br/functions/v1/transactions';
const SECRET_KEY = 'fl_live_RTdmT0ZLaldUYlBTU2Zn';
const PASSWORD = 'x';  // Use a senha específica, se aplicável

// Crie o valor da autenticação "Basic" em Base64
const authHeader = `Basic ${Buffer.from(`${SECRET_KEY}:${PASSWORD}`).toString('base64')}`;

app.post('/api/transactions', async (req, res) => {
    try {
        const response = await fetch(FLYPAYMENTS_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Erro na resposta da API: ${errorText}`);
            return res.status(response.status).json({ error: 'Erro ao processar a requisição' });
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error(`Erro ao fazer a requisição: ${error}`);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
