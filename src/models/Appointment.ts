import { Schema, model } from 'mongoose';

export interface ScheduleData {
  name: string,
  email: string,
  description: string,
  cpf: string,
  date: Date,
  time: string,
  finished: boolean,
  notified: boolean,
}

const appointment = new Schema<ScheduleData>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  cpf: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  finished: {
    type: Boolean,
    required: false,
  },
  notified: {
    type: Boolean,
    required: false,
  },
});

export default model<ScheduleData>('appointment', appointment);
