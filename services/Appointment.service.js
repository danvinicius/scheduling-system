const Appointment = require("../models/Appointment");
const appointmentFactory = require("../factories/AppointmentFactory");
const transporter = require("../mailer/mailer");

class AppointmentService {
  //Função que cria uma consulta
  async Create(name, email, cpf, description, date, time) {
    const newAppo = new Appointment({
      name,
      email,
      cpf,
      description,
      date,
      time,
      finished: false,
      notified: false,
    });

    try {
      await newAppo.save();
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  /*Função que retorna todas as consultas 
  Se o argumento for true, retorna as consultas finalizadas ou não
  Se o argumento for false, pega as consultas não finalizadas e passa elas na Factory, para serem mostradas
  no fullCalendar*/
  async GetAll(showFinished) {
    if (showFinished) {
      return await Appointment.find();
    } else {
      const simpleAppointments = await Appointment.find({ finished: false });
      const complexAppointments = [];
      simpleAppointments.forEach((appo) => {
        if (appo.date != undefined && appo.time != undefined) {
          complexAppointments.push(appointmentFactory.Build(appo));
        }
      });
      return complexAppointments;
    }
  }

  //Função que retorna uma consulta pelo id
  async GetById(id) {
    try {
      const appointment = await Appointment.findById(id);
      return appointment;
    } catch (e) {
      console.log(e);
    }
  }

  //Função que finaliza uma consulta
  async FinishAppointment(id) {
    try {
      await Appointment.findByIdAndUpdate(id, { finished: true });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  //Função utilizada na barra de buscas e procura por consultas pelo email e/ou cpf do paciente
  async Search(query) {
    try {
      const result = await Appointment.find().or([
        { email: query },
        { cpf: query },
      ]);
      return result;
    } catch (e) {
      console.log(e);
    }
  }

  /*Função que verifica se falta menos de 1 hora para a consulta do paciente
  Se sim, envia uma notificação por email para ele*/
  async sendNotification() {
    try {
      const appos = await this.GetAll(false);
      appos.forEach(async (appo) => {
        let date = appo.start.getTime();
        let hour = 1000 * 60 * 60;
        let gap = date - Date.now();
        if (gap <= hour) {
          if (!appo.notified) {
            await Appointment.findByIdAndUpdate(appo.id, { notified: true });
            transporter
              .sendMail({
                from: `${process.env.NOME} <${process.env.EMAIL}>`,
                to: appo.email,
                subject: "Consulta em breve!",
                html: `<h2>Olá ${
                  appo.name.split(" ")[0]
                }, sua consulta irá acontecer em 1 hora. </h2>`,
              })
              .then(() => {})
              .catch(() => {});
          }
        }
      });
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new AppointmentService();
