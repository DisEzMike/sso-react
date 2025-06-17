import { Router } from 'express';


const router = Router();

router.get('/', (req, res) => {
	res.json({ text: 'Hello, world!' });
});

export { router };
