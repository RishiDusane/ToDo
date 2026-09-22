import { Router } from 'express';
import { z } from 'zod';
import { Category } from '../models/index.js';
import { sendValidationError } from '../utils/http.js';
import { serializeCategory } from '../utils/serializers.js';
const router = Router();
const categorySchema = z.object({ name: z.string().trim().min(1).max(40), color: z.string().regex(/^#[0-9a-f]{6}$/i).default('#2f765c') });
router.get('/', async (request, response, next) => {
    try {
        const categories = await Category.findAll({ where: { userId: request.user.id }, order: [['name', 'ASC']] });
        return response.json({ categories: categories.map(serializeCategory) });
    }
    catch (error) {
        return next(error);
    }
});
router.post('/', async (request, response) => {
    try {
        const input = categorySchema.parse(request.body);
        const category = await Category.create({ ...input, userId: request.user.id });
        return response.status(201).json({ category: serializeCategory(category) });
    }
    catch (error) {
        return sendValidationError(response, error);
    }
});
router.put('/:id', async (request, response, next) => {
    try {
        const input = categorySchema.partial().parse(request.body);
        const category = await Category.findOne({ where: { id: request.params.id, userId: request.user.id } });
        if (!category)
            return response.status(404).json({ message: 'Category not found' });
        await category.update(input);
        return response.json({ category: serializeCategory(category) });
    }
    catch (error) {
        return next(error);
    }
});
router.delete('/:id', async (request, response, next) => {
    try {
        const deleted = await Category.destroy({ where: { id: request.params.id, userId: request.user.id } });
        return deleted ? response.status(204).send() : response.status(404).json({ message: 'Category not found' });
    }
    catch (error) {
        return next(error);
    }
});
export default router;
