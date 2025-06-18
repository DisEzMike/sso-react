import { Router } from 'express';
import { loginRoute, token } from '../controllers/auth.controller.js';


const router = Router();

router.get('/', (req, res) => {
	res.json({ text: 'Hello, world!' });
});

router.post("/login", loginRoute);
router.post("/token", token);
router.post("/user", token);

export { router };
