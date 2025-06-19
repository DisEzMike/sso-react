import { Router } from 'express';
import { checkAdmin } from '../middleware/auth.ts';
import { createClient } from '../controllers/admin.controller.ts';


const router = Router();

router.get('/', (req, res) => {
    res.json({ text: 'Hello, world!' });
});

router.get("/createClient", checkAdmin, createClient);

export { router };
