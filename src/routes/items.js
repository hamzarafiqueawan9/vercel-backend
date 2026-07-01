import express from 'express';
import {
  getItems,
  createItem,
  deleteItem,
  updateItem,
} from '../controllers/itemsController.js';

const router = express.Router();

router.get('/',      getItems);
router.post('/',     createItem);
router.put('/:id',   updateItem);
router.delete('/:id', deleteItem);

export default router;
