import nodemailer from 'nodemailer';

// let transporter = nodemailer.createTransport({
//   host: 'smtp.example.com',
//   port: 465,
//   secure: true,
//   auth: {
//     type: 'custom',
//     method: 'MY-CUSTOM-METHOD', // forces Nodemailer to use your custom handler
//     user: 'username',
//     pass: 'verysecret',
//   },
// });

// export const verifyUserEmail = async (email, name, username, token) => {
//   try {
//     let info = await transporter.sendMail({
//       from: '"Your App" <no-reply@yourapp.com>', // sender address
//       to: email, // list of receivers
//       subject: 'Email Verification', // Subject line
//       text: `Hello ${name} please verify your email by clicking the link`, // plain text body
//       html: `<b>Please verify your email by clicking on the following link:</b> <a href="${verificationUrl}">Verify Email</a>`, // html body
//     });
//   } catch (error) {}
// };

export const sendEmail = async (email, subject, url) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      post: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: `Welcome to Cybersafe. Please click on the link to verify your email ID. \n ${url}`,
    });
    console.log('Email sent Successfully');
  } catch (error) {
    console.log('Email not sent');
    console.log('error :>> ', error);
  }
};
