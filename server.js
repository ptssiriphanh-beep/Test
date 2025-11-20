const express = require('express');
const path = require('path');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/order', (req, res) => {
  const { name, item, quantity } = req.body;
  if (!name || !item || !quantity) {
    return res.status(400).json({ error: 'name, item, quantity required' });
  }
  const order = {
    id: Date.now(),
    name,
    item,
    quantity: Number(quantity),
    status: 'received'
  };
  res.json({ success: true, order });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
