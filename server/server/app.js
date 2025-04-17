import express from 'express'
import cors from 'cors'
import routes from './routes/index.js'
const app = express()

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200
}

// initial middlerware
app.use(cors(corsOptions));
app.use(express.json());

app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    next();
});


app.use('/auth', routes.auth);

export default app