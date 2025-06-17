import { Router } from 'express';
import { loginRoute } from '../controllers/auth.controller.js';


const router = Router();

router.get('/', (req, res) => {
	res.json({ text: 'Hello, world!' });
});

router.post("/login", loginRoute);

export { router };
