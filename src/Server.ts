import express, { Express } from 'express';
import AppointmentController from './controller/AppointmentController';
const ac = new AppointmentController();

export default class Server {

    constructor(private _app: Express, private _port: number | string) {}

    get app() {
        return this._app;
    }

    get port() {
        return this._port;
    }

    set app(app: Express) {
        this._app = app;
    }

    set port(port: number | string) {
        this._port = port;
    }

    config() {
        this.app.use(express.urlencoded({ extended: false }))
        this.app.use(express.json());
        this.app.set('view engine', 'ejs')
        this.app.use(express.static('public'))
        this.app.get('/', ac.renderHomeView);
        this.app.get('/getcalendar', ac.getCalendar);
        this.app.get('/cadastro', ac.renderSignupView);
        this.app.get('/list', ac.getAppointments);
        this.app.post('/cadastro', ac.signup);
        this.app.get('/appointment/:id', ac.getAppointmentById);
        this.app.get('/search', ac.search);
        this.app.post('/appointment/finish', ac.finish);
    }

    run() {
        this.app.listen(this.port, () => {
            console.log('Server running on port ' + this.port);
        });
    }
}