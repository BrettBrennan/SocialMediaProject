const express = require('express');
const router = express.Router();
const messages = require('../controllers/message.controller');
const auth = require('../middleware/auth');

// ?@route GET api/messages/id
// ?@desc Get a message by user id
// ?@access Public or Private depending on messageer's preference

router.get('/conversations', auth, messages.getConversations);
router.get('/user/:id', auth, messages.getUserMessages);
router.get('/unread/:id', auth, messages.getUnreadMessages);
router.get('/', auth, messages.getUserMessages);
// ?@route POST api/messages
// ?@desc Create a message
// ?@access Private

router.post('/', auth, messages.create);

// ?@route DELETE api/messages
// ?@desc Delete all messages
// ?@access Private

router.delete('/:id', auth, messages.delete);

module.exports = router;
