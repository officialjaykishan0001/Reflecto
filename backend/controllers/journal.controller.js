const Journal = require('../models/journal.model');

exports.createJournal = async (req, res) => {
    const { title, content } = req.body;

    try {
        const journal = await Journal.create({
            user: req.user.id,
            title,
            content,
        });

        res.status(201).json(journal);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create journal entry', error: err.message });
    }
};

exports.getJournals = async (req, res) => {
    try{
        const journals = await Journal.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(journals);

    }catch(err){
        res.status(500).json({ message: 'Failed to fetch journal entries', error: err.message });
    }
};

exports.getJournal = async (req, res) => {
    const { id } = req.params;
    try{
        const journal = await Journal.findOne({ _id: id, user: req.user.id });
        if (!journal || journal.user.toString() !== req.user.id) {
            return res.status(404).json({ message: "Journal not found or unauthorized" });
        }
        res.status(200).json(journal);
    }catch(err){
        res.status(500).json({ message: 'Failed to fetch journal', error: err.message });
    }
}

exports.updateJournal = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    try{
        const journal = await Journal.findOneAndUpdate(
            { _id: id, user: req.user.id },
            { title, content },
            { new: true }
        );

        if(!journal) return res.status(404).json({ message: 'Journal not found ' });
        res.status(200).json(journal);
    }catch(err){
        res.status(500).json({ message: 'Failed to update journal entry', error: err.message });
    }
};

exports.deleteJournal = async (req, res) => {
    const { id } = req.params;

    try{
        const journal = await Journal.findOneAndDelete({ _id: id, user: req.user.id });

        if( !journal) return res.status(404).json({ message: "Journal not found" })
        res.status(200).json({ message: 'Journal deleted successfully' });   
    }catch(err){
        res.status(500).json({ message: 'Failed to delete journal entry', error: err.message });
    }
}