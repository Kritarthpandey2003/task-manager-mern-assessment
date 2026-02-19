module.exports = (req, res) => {
    res.status(200).json({
        message: 'Debug endpoint works via JS!',
        time: new Date().toISOString()
    });
};
