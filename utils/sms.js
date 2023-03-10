const dotenv = require("dotenv");
dotenv.config();
const { TWILIO_SERVICE_SID, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } =
  process.env;
const client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, {
  lazyLoading: true,
});

/* SEND OTP */
const sendOTP = async (req, res, next) => {
  const { countryCode, phoneNumber, otpType } = req.body;
  try {
    const otpResponse = await client.verify
      .services(TWILIO_SERVICE_SID)
      .verifications.create({
        to: `${countryCode}${phoneNumber}`,
        channel: otpType,
      });
    res
      .status(200)
      .json(`OTP send successfully!: ${JSON.stringify(otpResponse)}`);
  } catch (err) {
    res
      .status(err?.status || 400)
      .json(err?.message || "Something went wrong!");
  }
};

/* VERIFY OTP */
const verifyOTP = async (req, res, next) => {
  const { countryCode, phoneNumber, otp } = req.body;
  try {
    const verifiedResponse = await client.verify
      .services(TWILIO_SERVICE_SID)
      .verificationChecks.create({
        to: `${countryCode}${phoneNumber}`,
        code: otp,
      })
      .then((verification_check) => console.log(verification_check.status));
    res
      .status(200)
      .json(`OTP verified successfully!: ${JSON.stringify(verifiedResponse)}`);
  } catch (err) {
    res
      .status(err?.status || 400)
      .json(err?.message || "Something went wrong!");
  }
};

module.exports = { sendOTP, verifyOTP };

// const accountSid = "AC41678a548e89c03acda1f41db2487cfe";
// const authToken = "ff9dfc5e52ee89c49ad2fcbc8d93c509";
// const verifySid = "VAe25e5180c263fef55fa40561d0f5d833";
// const client = require("twilio")(accountSid, authToken);

// client.verify.v2
//   .services(verifySid)
//   .verifications.create({ to: "+989934901913", channel: "sms" })
//   .then((verification) => console.log(verification.status))
//   .then(() => {
//     const readline = require("readline").createInterface({
//       input: process.stdin,
//       output: process.stdout,
//     });
//     readline.question("Please enter the OTP:", (otpCode) => {
//       client.verify.v2
//         .services(verifySid)
//         .verificationChecks.create({ to: "+989934901913", code: otpCode })
//         .then((verification_check) => console.log(verification_check.status))
//         .then(() => readline.close());
//     });
//   });
