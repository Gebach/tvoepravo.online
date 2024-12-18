import express from 'express'
import nodemailer from 'nodemailer'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).send(`Requested from ${req.hostname} : <h1>Hello World!<h1/>`)
})

app.post('/send-mail', async (req, res) => {
  const { name, email, message } = req.body

  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  })

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: process.env.MAIL_TO,
    subject: 'Заявка с сайта "tvoepravo.online"',
    text: `Имя: ${name},
          Почта: ${email}${message ? ', Сообщение: ' + message : ''}`,
    html: `<p style="font-size: 18px"><b>Имя: ${name}</b>, <br>
           <b>Почта: ${email}</b>${message ? ',<br> <b>Сообщение:</b>' + message : ''}</p>`,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Письмо отправлено:', info.response)
    return res.status(200).json({ message: 'Email sent successfully' })
  } catch (error) {
    return res.status(500).json({ error: `Failed to send email, ${error}` })
  }
})

app.listen(3000, () => {
  console.log('Server running on https://tvoepravo.online:3000')
})
