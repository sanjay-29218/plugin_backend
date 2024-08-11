import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { db } from './controller/db'; // Import the Firebase DB instance
import express from 'express'
import cors from 'cors'
const app = express()

app.use(express.json())

app.use(cors())



interface DecodedToken {
    email: string;
    sub: string;  // Unique identifier for the user
    [key: string]: any;
}


export const authHandler = async (req: Request, res: Response) => {
    try {
        const { id_token } = req.body;

        console.log('id_token', id_token, req.body);


        // Decode the ID token to get the user data
        const decodedToken = jwt.decode(id_token) as DecodedToken;
        console.log("🚀 ~ authHandler ~ decodedToken:", decodedToken)



        if (!decodedToken || !decodedToken.email) {
            return res.status(400).json({ error: 'Invalid ID token' });
        }

        const userId = decodedToken.sub;
        console.log("🚀 ~ authHandler ~ userId:", userId)

        // Reference to the user's data in the database
        const userRef = db.ref(`users/${userId}`);

        // Check if the user already exists
        const snapshot = await userRef.once('value');
        console.log('hey snapshot', snapshot);

        if (snapshot.exists()) {
            // User exists, return existing data
            const existingUserData = snapshot.val();
            return res.status(200).json({ status: true, message: 'User already signed in', user: existingUserData });
        } else {
            // User doesn't exist, create new entry
            const userData = {
                email: decodedToken.email,
                userId: userId,
                token: id_token,
            };
            console.log('user data', userData);


            await userRef.set(userData);

            return res.status(201).json({ message: 'User data saved successfully', user: userData, status: true });
        }
    } catch (error) {
        console.log('error........');

        console.error('Error handling auth:', error);
        res.status(500).json({ error: 'Internal server error', status: false });
    }
};

app.post('/auth', authHandler)
app.listen('3000', () => console.log('port running at 3000')
)
