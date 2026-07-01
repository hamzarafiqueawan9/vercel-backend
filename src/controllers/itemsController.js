import Item from '../models/Item.js';

export async function getItems(req, res) {
  try {
    const items = await Item.find({}).sort({ value: -1 }).lean();
    res.json(items);
  } catch (error) {
    console.error('getItems error:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
}

export async function createItem(req, res) {
  try {
    const item = await Item.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    console.error('createItem error:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
}

export async function deleteItem(req, res) {
  try {
    const deleted = await Item.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Item deleted', id: req.params.id });
  } catch (error) {
    console.error('deleteItem error:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
}

export async function updateItem(req, res) {
  try {
    const updated = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: 'Item not found' });
    res.json(updated);
  } catch (error) {
    console.error('updateItem error:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
}
