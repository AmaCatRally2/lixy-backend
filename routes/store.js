const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const StoreGame = require('../models/StoreGame');

// @route    GET api/store/games
// @desc     Get all store games
// @access   Public
router.get('/games', async (req, res) => {
  try {
    const games = await StoreGame.find().sort({ createdAt: -1 });
    res.json(games);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/store/games
// @desc     Add a new game to the store (Admin Only)
// @access   Private (Admin)
router.post('/games', auth, adminAuth, async (req, res) => {
  const { name, description, genre, downloadUrl, coverImage, bannerImage, size, developer, publisher, releaseDate, price } = req.body;

  try {
    const newGame = new StoreGame({
      name, description, genre, downloadUrl, coverImage, bannerImage, size, developer, publisher, releaseDate, price,
      addedBy: req.user.id // Oyunu ekleyen admin'in ID'si
    });

    const game = await newGame.save();
    res.json(game);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/store/games/:id
// @desc     Update a store game (Admin Only)
// @access   Private (Admin)
router.put('/games/:id', auth, adminAuth, async (req, res) => {
  const { name, description, genre, downloadUrl, coverImage, bannerImage, size, developer, publisher, releaseDate, price } = req.body;

  const gameFields = { name, description, genre, downloadUrl, coverImage, bannerImage, size, developer, publisher, releaseDate, price };
  gameFields.updatedAt = Date.now();

  try {
    let game = await StoreGame.findById(req.params.id);
    if (!game) return res.status(404).json({ msg: 'Game not found' });

    game = await StoreGame.findByIdAndUpdate(
      req.params.id,
      { $set: gameFields },
      { new: true }
    );
    res.json(game);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/store/games/:id
// @desc     Delete a store game (Admin Only)
// @access   Private (Admin)
router.delete('/games/:id', auth, adminAuth, async (req, res) => {
  try {
    const game = await StoreGame.findById(req.params.id);
    if (!game) return res.status(404).json({ msg: 'Game not found' });

    await StoreGame.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Game removed from store' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;