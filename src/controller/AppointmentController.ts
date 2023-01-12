import AppointmentService from '../services/AppointmentService';
import { ScheduleData } from '../models/Appointment';
import {Request, Response} from 'express';

export default class ScheduleController {

    renderHomeView(req: Request, res: Response) {
      res.render('index');
    }

    renderSignupView(req: Request, res: Response) {
      res.render('cadastro');
    }

    // get all the appoitments that are not finished yet
    async getCalendar(req: Request, res: Response) {
      const calendar = await AppointmentService.GetAll(false);
      res.json(calendar);
    }

    async getAppointments(req: Request, res: Response) {
      const appos = await AppointmentService.GetAll(true);
      res.render('list', { appos: appos });
    }

    async getAppointmentById(req: Request, res: Response) {
      const { id } = req.params;
      const appointment = await AppointmentService.GetById(id);
      res.render('consulta', { appo: appointment });
    };

    // sign up a new appointment
    async signup(req: Request, res: Response) {
      const data: ScheduleData = req.body;
      try {
          const created = await AppointmentService.Create(data);
          if (created) {
            return res.redirect('/');
          }
          return res.send('An error occured while the schedule :(');
        } catch (e) {
          console.log(e);
        }
      }
      
      async search(req: Request, res: Response) {
        const search = req.query.search;
        const appos = await AppointmentService.Search(search);
        res.render('list', { appos: appos });
      };
      
      // finish the appointment
      async finish(req: Request, res: Response) {
        const { id } = req.body;
        const finished = await AppointmentService.FinishAppointment(id);
        if (finished) {
        return res.redirect('/');
      }
      return res.status(500).send('An error occured while the finishing :(');
    }
}