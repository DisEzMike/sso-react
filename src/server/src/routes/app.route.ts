import { Router } from 'express';
import { getUser } from '../controllers/app.controller.ts';


const router = Router();

router.get('/', (req, res) => {
    res.json({ text: 'Hello, world!' });
});

router.post("/me", getUser);

export { router };
