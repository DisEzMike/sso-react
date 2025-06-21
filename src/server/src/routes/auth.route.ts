import { Router } from 'express';
import { authorize, token, discovery, register, revokeToken } from '../controllers/auth.controller.ts';


const router = Router();

router.get('/', (req, res) => {
	res.json({ text: 'Hello, world!' });
});

router.post("/register", register);
router.get("/authorize", authorize);
router.post("/authorize", authorize);
router.post("/token", token)
router.get("/logout", revokeToken);

router.get('/.well-known/openid-configuration', discovery);

export { router };
