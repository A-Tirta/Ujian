import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import rootRoutes  from './routes';

async function main() {
    dotenv.config()
    
    const app = express()
    
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    app.use(
        cors({
          origin: '*',
          credentials: true,
        })
      );
    
    app.use(rootRoutes)

    app.listen(process.env.PORT, () => {
        console.log('Server Up and Running Port: ' + process.env.PORT);
    });
}

main().catch((err) => {
    console.log(err);
});