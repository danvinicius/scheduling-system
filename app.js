require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const AppointmentService = require("./services/Appointment.service");
app
  .set("view engine", "ejs")
  .use(express.static("public"))
  .use(express.urlencoded({ extended: false }))
  .use(express.json());

mongoose
  .connect("mongodb://localhost:27017/agendamento-clientes", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Conectado ao mongo com sucesso");
  })
  .catch((e) => {
    console.log("Erro ao conectar com o mongo");
  });

//Rota do calendário
app.get("/", (req, res) => {
  res.render("index");
});

//Rota de cadastro
app.get("/cadastro", (req, res) => {
  res.render("cadastro");
});

/*Rota que o fullCalendar utiliza para renderizar os agendamentos
Deve retornar um json com os agendamentos*/
app.get("/getcalendar", async (req, res) => {
  const calendar = await AppointmentService.GetAll(false);
  res.json(calendar);
});

//Rota que mostra detalhes de um agendamento pelo Id
app.get("/appointment/:id", async (req, res) => {
  const { id } = req.params;
  const appointment = await AppointmentService.GetById(id);
  res.render("consulta", { appo: appointment });
});

//Rota que lista todos os agendamentos
app.get("/list", async (req, res) => {
  const appos = await AppointmentService.GetAll(true);
  res.render("list", { appos: appos });
});

//Rota utilizada pela barra de buscas
app.get("/search", async (req, res) => {
  const search = req.query.search;
  const appos = await AppointmentService.Search(search);
  console.log(appos);
  res.render("list", { appos: appos });
});

//Rota para cadastrar nova consulta
app.post("/cadastro", async (req, res) => {
  const { name, email, cpf, description, date, time } = req.body;
  try {
    let status = await AppointmentService.Create(
      name,
      email,
      cpf,
      description,
      date,
      time
    );
    if (status) {
      res.redirect("/");
    } else {
      res.send("Ocorreu um erro durante o agendamento :(");
    }
  } catch (e) {
    console.log(e);
  }
});

//Rota para finalizar consulta
app.post("/finish", async (req, res) => {
  const { id } = req.body;
  await AppointmentService.FinishAppointment(id);
  res.redirect("/");
});

//setInterval que verifica a cada 5min se falta menos de 1 hora para a consulta de algum paciente e envia notificação
let poolTime = 5 * 1000;
setInterval(async () => {
  await AppointmentService.sendNotification();
}, poolTime);

port = 8081;
app.listen(port, () => {
  console.log("Servidor rodando na porta " + port);
});
