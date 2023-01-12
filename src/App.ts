import express from 'express';
import Server from './Server';
import * as dotenv from 'dotenv';
dotenv.config();

//=== connection ===//
import './database/connection';
import AppointmentService from './services/AppointmentService';

//=== instance server ===//
const port = process.env.SERVER_PORT || 8081;
const app = express()
const server = new Server(app, port);

// check if it lefts less than one hour for the apoointment and send notification
let poolTime = 5 * 1000;
setInterval(async () => {
  await AppointmentService.sendNotification();
}, poolTime);

//===config and run ===//
server.config();
server.run();