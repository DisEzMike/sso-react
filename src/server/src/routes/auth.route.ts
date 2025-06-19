import { Router } from 'express';
import { authorize, token, discovery, register } from '../controllers/auth.controller.ts';


const router = Router();

router.get('/', (req, res) => {
	res.json({ text: 'Hello, world!' });
});

router.post("/login", authorize);
router.post("/register", register);
router.post("/token", token);

router.get('/.well-known/openid-configuration', discovery);

export { router };
