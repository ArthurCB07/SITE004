const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Dados de exemplo
const events = [
  { id:1, title:'Torneio de Futsal', date:'2025-06-15', description:'Inscreva sua equipe!'},
  { id:2, title:'Aula de Hidroginástica', date:'2025-06-20', description:'Atividade na piscina.'}
];
const memberStats = { totalMembers:256 };

app.use(express.static('public'));
app.get('/api/events',(req,res)=>res.json(events));
app.get('/api/members/stats',(req,res)=>res.json(memberStats));
app.listen(PORT,()=>console.log(`API CAAT rodando na porta ${PORT}`));