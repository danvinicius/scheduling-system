import Appointment from '../models/Appointment';
import appointmentFactory from '../factories/AppointmentFactory';
import Mailer from '../mailer/Mailer';
import { ScheduleData } from '../models/Appointment';

export default class AppointmentService {
  //Função que cria uma consulta
  static async Create(data: ScheduleData) {
    data.date = new Date(`${data.date}T${data.time}`)
    const newAppo = new Appointment({ ...data, finished: false, notified: false });
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
  static async GetAll(showFinished: boolean) {
    if (showFinished) {
      return await Appointment.find();
    } else {
      const simpleAppointments = await Appointment.find({ finished: false });
      const complexAppointments: Array<any> = [];
      simpleAppointments.forEach((appo: any) => {
        if (appo.date) {
          complexAppointments.push(appointmentFactory.Build(appo));
        }
      });
      return complexAppointments;
    }
  }

  //Função que retorna uma consulta pelo id
  static async GetById(id: string) {
    try {
      const appointment = await Appointment.findById(id);
      return appointment;
    } catch (e) {
      console.log(e);
    }
  }

  //Função que finaliza uma consulta
  static async FinishAppointment(id: string) {
    try {
      await Appointment.findByIdAndUpdate(id, { finished: true });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  //Função utilizada na barra de buscas e procura por consultas pelo email e/ou cpf do paciente
  static async Search(query: any) {
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
  static async sendNotification() {
    try {
      const appos = await this.GetAll(false);
      appos.forEach(async (appo: any) => {
        let date = appo.start;
        let hour = 1000 * 60 * 60;
        let gap = date - Date.now();
        if (gap <= hour) {
          
          
          if (!appo.notified) {
            const from = `${process.env.NOME} <${process.env.EMAIL}>`;
            const to = appo.email;
            const subject = "Consulta em breve!";
            const html = `<h2>Olá ${
              appo.name.split(" ")[0]
            }, sua consulta irá acontecer em 1 hora. </h2>`;
            const mailer = new Mailer(from, to, subject, html);
            const sent = await mailer.sendMail();
            console.log('e-mail enviado');
            if(sent) {
              await Appointment.findByIdAndUpdate(appo.id, { notified: true });
            }
          }
        }
      });
    } catch (e) {
      console.log(e);
    }
  }
}
