const cors = (req, res) => {
	res.setHeader("access-control-allow-origin", "*");
};

module.exports = cors;
