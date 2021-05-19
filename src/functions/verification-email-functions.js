import sgMail from "@sendgrid/mail";
import { success, error } from "consola";
import { SENDGRID_API_KEY } from "../constant";
sgMail.setApiKey(SENDGRID_API_KEY);
const SendMail = (to, from, subject, text, html) => {
  try {
    sgMail.send({ to, from, subject, text, html });
    success({ message: "Mail Send SuccessFully", badge: true });
  } catch (err) {
    error({ message: err.message, badge: true });
  }
};
export default SendMail;
