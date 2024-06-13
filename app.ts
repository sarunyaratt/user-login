import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connect } from './config/database';
import User from './model/user';
import passport from './middleware/passport';

connect();

const app = express();

app.use(express.json());
app.use(passport.initialize());

interface RegisterRequestBody {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}

interface LoginRequestBody {
    email: string;
    password: string;
}

// register
app.post("/register", async (req: Request<{}, {}, RegisterRequestBody>, res: Response) => {
    try {
        // get user input
        const { first_name, last_name, email, password } = req.body;

        // validate user input
        if (!(email && password && first_name && last_name)) {
            return res.status(400).send("All input is required");
        }

        // check and validate if user already exist
        const existUser = await User.findOne({ email });

        if (existUser) {
            return res.status(409).send("User already exists. Please login");
        }

        // encrypt user password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // create user in the database
        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(),
            password: encryptedPassword
        });

        // create token
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY as string,
            {
                expiresIn: "2h"
            }
        );

        // save user token
        user.token = token;

        // return new user
        return res.status(201).json("Registration successful");

    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
});

// login
app.post("/login", async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
    try {
        // get user input
        const { email, password } = req.body;

        // validate user input
        if (!(email && password)) {
            return res.status(400).send("All input is required");
        }

        // validate if user exists
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // create token
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY as string,
                {
                    expiresIn: "2h"
                }
            );
            // save user token
            user.token = token;

            return res.status(200).json(user);
        }

        return res.status(400).send("Invalid Credentials");
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
});

app.post('/welcome', passport.authenticate('jwt', { session: false }), (req: Request, res: Response) => {
    res.status(200).send('Welcome 🙋‍♂️');
});

export default app;
