
import express from 'express';
import userRoutes from '../interfaces/routes/userAuth';
import { connectToDatabase } from '../infrastructure/database/connection';

const PORT = 3000;
const app = express();

app.use(express.json());
app.use("/auth", userRoutes);

app.listen(PORT, async () => {
    console.log('Server is running on port 3000');
    await connectToDatabase()
        .then(() => {
            console.log("connected to database 🤝");
            console.log(`Listening on http://localhost:${PORT}`);
        })
        .catch((error) => {
            console.log(error);
        });
})




