const nodemailer = require("nodemailer");
require("dotenv").config();

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendNotifWhenCreateOrder(toEmail, status, createdAt) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: toEmail,
      subject: "New Order",
      text: `Created new order\nStatus: ${status}\nDate: ${createdAt.toLocaleString(
        "uz-UZ"
      )}`,
    });
  }

  async sendNotifWhenChangeStatus(toEmail, status, createdAt) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: toEmail,
      subject: "Order Status changed",
      text: `Order Status\nStatus: ${status}\nDate: ${createdAt.toLocaleString(
        "uz-UZ"
      )}`,
    });
  }
}

module.exports = new MailService();
