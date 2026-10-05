import 'dotenv/config'
import { app } from './app.js'
import { ejecutarSemillas } from './db/semillas.js'

ejecutarSemillas()


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});