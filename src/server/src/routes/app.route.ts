import { Router } from 'express';
import { getUser } from '../controllers/app.controller.ts';
import { authMiddleware } from '../middleware/auth.ts';


const router = Router();

router.get('/', (req, res) => {
    res.json({ text: 'Hello, world!' });
});

router.get("/me", authMiddleware, getUser);

export { router };
