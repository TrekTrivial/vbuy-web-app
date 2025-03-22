require("dotenv").config();
const OTPgen = require("otp-generator");
const SibApiV3Sdk = require("sib-api-v3-sdk");

const genOTP = () => {
  const otp = OTPgen.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  return otp;
};

const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.EMAIL_API_KEY;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

const sendOTPemail = async ({ name, email }) => {
  const message = `<html><head></head><body><h5>${name},</h5><br><p>Thank you for joining VBuy! Use this code to verify yourself: ${genOTP()}</p><br><br><p><strong>Team VBuy</strong></p></body></html>`;
  const emailData = {
    sender: { name: "VBuy", email: "crypticopgaming@gmail.com" },
    to: [{ email }],
    subject: "Verify your account",
    textContent: message,
  };

  try {
    await emailApi.sendTransacEmail(emailData);
  } catch (e) {
    throw new Error(e);
  }
};

(async () => {
  await sendOTPemail({ name: "Joji", email: "viyane2122@eligou.com" });
})();

module.exports = genOTP;
