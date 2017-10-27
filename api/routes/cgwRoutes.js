'use strict';

module.exports = function(app) {
	var contractAPI = require('../controllers/cgwController');

  	// Routes
	app.route('/sendMoney')
    	.post(contractAPI.sendMoney);
	app.route('/estimateGas')
    	.post(contractAPI.estimateGas);
};
