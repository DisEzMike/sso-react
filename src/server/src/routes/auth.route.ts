import { Router } from 'express';
import { authorize, token, discovery, register, revokeToken } from '../controllers/auth.controller.ts';
import { ssoAuth } from '../middleware/auth.ts';


const router = Router();

router.get('/', (req, res) => {
	res.json({ text: 'Hello, world!' });
});
router.post('/', ssoAuth);


router.post("/login", authorize);
router.post("/register", register);
router.post("/token", token)
router.get("/logout", revokeToken);

router.get('/.well-known/openid-configuration', discovery);

export { router };
