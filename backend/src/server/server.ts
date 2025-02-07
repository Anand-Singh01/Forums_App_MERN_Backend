import express from 'express';

import { connectToDatabase } from '../infrastructure/database/connection';

const app = express();
app.listen(3000, async () => {
    console.log('Server is running on port 3000');
    connectToDatabase()
        .then(() => {
            console.log("connected to database 🤝");
        })
        .catch((error) => {
            console.log(error);
        });
})