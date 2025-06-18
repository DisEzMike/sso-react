import { Router } from 'express';
import { authorize, token, me } from '../controllers/auth.controller.js';


const router = Router();

router.get('/', (req, res) => {
	res.json({ text: 'Hello, world!' });
});

router.post("/login", authorize);
router.post("/token", token);
router.get("/user", me);

export { router };
