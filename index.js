const app = require('express')()
const http = require('http').createServer(app)
const cors = require('cors')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const router = require('./router')

const REQUEST_LIMIT = '10mb'
const PORT = process.env.PORT || 8888

const start = async () => {
  http.listen(PORT, () =>
    console.info(`Server started http://localhost:${PORT}`)
  )

  app
    .disable('etag')
    .disable('x-powered-by')
    .use(cors({
      origin: true,
      credentials: true
    }))
    .options('*', cors())
    .use(
      bodyParser.urlencoded({
        limit: REQUEST_LIMIT,
        extended: false
      })
    )
    .use(bodyParser.json({ limit: REQUEST_LIMIT }))
    .use(
      fileUpload({
        limits: { fileSize: 25 * 1024 * 1024 }, // 25 mb
        useTempFiles: false,
        abortOnLimit: true
      })
    )
    .use(router())
    .get(['/', '/health'], (_, __) => __.send('OK'))
}

start()
