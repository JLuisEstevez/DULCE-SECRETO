import 'dotenv/config'
import { app } from './app.js'
import { ejecutarSemillas } from './db/semillas.js'

ejecutarSemillas()

const PUERTO = process.env.PORT || 4000

app.listen(PUERTO, () => {
  console.log(`Dulce Secreto API escuchando en http://localhost:${PUERTO}`)
})

