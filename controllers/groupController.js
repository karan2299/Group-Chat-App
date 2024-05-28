const Group = require('../models/Group');
const User = require('../models/User');

exports.createGroup = async (req, res) => {
    const { name, members } = req.body;

    try {
        let group = await Group.findOne({ name });
        if (group) {
            return res.status(400).json({ msg: 'Group already exists' });
        }

        group = new Group({
            name,
            members
        });

        await group.save();
        res.status(201).json({ msg: 'Group created successfully', group });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.deleteGroup = async (req, res) => {
    const { id } = req.params;

    try {
        let group = await Group.findById(id);
        if (!group) {
            return res.status(404).json({ msg: 'Group not found' });
        }

        await group.remove();
        res.json({ msg: 'Group deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.searchGroups = async (req, res) => {
    const { name } = req.query;

    try {
        let groups = await Group.find({ name: new RegExp(name, 'i') });
        res.json(groups);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.addMember = async (req, res) => {
    const { groupId, userId } = req.body;

    try {
        let group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ msg: 'Group not found' });
        }

        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (group.members.includes(userId)) {
            return res.status(400).json({ msg: 'User is already a member of the group' });
        }

        group.members.push(userId);
        await group.save();
        res.json({ msg: 'Member added successfully', group });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
