import * as nodemailer from "nodemailer";

export default class Mailer {

    constructor(
        public from?: string,
        public to?: string,
        public subject?: string,
        public message?: string) { }


    async sendMail() {
        let mailOptions = {
            from: this.from,
            to: this.to,
            subject: this.subject,
            html: this.message
        };

        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            port: Number(process.env.PORT),
            secure: false,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS
            },
            tls: { rejectUnauthorized: false }
        });
        try {
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                throw new Error('Falha ao enviar mensagem');
            } else {
                return true;
            }
        });
        return true;
        } catch(e: any) {
          return false;
        }
      
    }

}
