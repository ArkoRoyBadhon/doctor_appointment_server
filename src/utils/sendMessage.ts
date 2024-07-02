import nodemailer from "nodemailer";

export const sendMessage = async (
  senderMail: string,
  receiverMail: string,
  subject: string,
  html: string,
  attachments?: [{ filename: string; path: string; cid: string }]
) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL as string,
      pass: process.env.MAILPASS as string,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });

  const mailOptions = {
    from: senderMail,
    to: receiverMail,
    subject: subject,
    html: html,
    attachments: attachments || [],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export default sendMessage;
