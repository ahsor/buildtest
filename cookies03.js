const express = require('express')
const cookieParser = require('cookie-parser')

const app = express()
app.use(cookieParser())

app.get('/', (req, res) => {
  res.send('Hello 🍪')
})

app.get('/set-cookie', (req, res) => {
  // res.setHeader('set-cookie', 'foo=bar')
  res.cookie('foo', 'bar', {
    // maxAge: 5000,
    // expires: new Date('26 July 2021'),
    // httpOnly: true,  // 브라우저단에서 읽지 못함 
    // secure: true,
    // domain: 'example.com',
  })
  // res.cookie('fizz', 'buzz')
  res.send('Cookies are set')
})

app.get('/get-cookie', (req, res) => {
  console.log(req.cookies)
  res.send(req.cookies)
})

app.get('/del-cookie', (req, res) => {
  res.clearCookie('views')
  res.send('Cookie has been deleted')
})

app.listen(3000, () => console.log('🍪 server on port 3000'))