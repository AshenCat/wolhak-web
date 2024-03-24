import mongoose from 'mongoose';
import { DB_CONFIG_STRING } from '../_db/config';

const connection: { isConnected?: number } = {};

const dbConnect = async () => {
    try {
        if (connection.isConnected) {
            console.log('DB already connected');
            return;
        }

        const db = await mongoose.connect(DB_CONFIG_STRING);
        connection.isConnected = db.connections[0].readyState;
        console.log('DB Connected');
    } catch (err) {
        console.error('DB CONNECT ERROR');
        console.error(err);
    }
};

export default dbConnect;
