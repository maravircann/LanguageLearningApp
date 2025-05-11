import express from 'express'
import cors from 'cors'
import routes from './routes/index.js'
const app = express()

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.json());

app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    next();
});


app.use('/auth', routes.auth);
app.use('/api', routes.lessons); 
app.use('/api', routes.tests);
app.use('/api', routes.words);
app.use('/api', routes.expressions);
app.use('/api', routes.wordFlashcards);
app.use('/api', routes.report);
app.use('/api', routes.domains);

export default app