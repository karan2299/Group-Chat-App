const Message = require('../models/Message');
const Group = require('../models/Group');

exports.sendMessage = async (req, res) => {
    const { groupId, content } = req.body;
    const userId = req.user.id;

    try {
        let group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ msg: 'Group not found' });
        }

        let message = new Message({
            groupId: groupId,
            sender: userId,
            content:content
        });

        await message.save();
        res.status(201).json({ msg: 'Message sent successfully', message });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.likeMessage = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        let message = await Message.findById(id);
        if (!message) {
            return res.status(404).json({ msg: 'Message not found' });
        }

        if (message.likes.includes(userId)) {
            return res.status(400).json({ msg: 'You already liked this message' });
        }

        message.likes.push(userId);
        await message.save();
        res.json({ msg: 'Message liked successfully', message });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
