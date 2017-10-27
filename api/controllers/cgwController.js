'use strict';

exports.sendMoney = function(req, res) {
	var Web3 = require('web3');
	var contractAddress = '0x4eff9837ebd42827edbadbcfec8c7b4f9e5b0d39';
	var abiArray = [{"constant":false,"inputs":[{"name":"_address","type":"address"}],"name":"getRating","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"transactionHash","type":"bytes32"}],"name":"rollbackvOverdueTransaction","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"balance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"toPerson","type":"address"},{"name":"comment","type":"string"},{"name":"trustbrokers","type":"address[]"}],"name":"sendMoney","outputs":[{"name":"","type":"bytes32"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"transactionHash","type":"bytes32"},{"name":"comment","type":"string"}],"name":"provideValidation","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"transactionHash","type":"bytes32"}],"name":"receiveMoney","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"toPerson","type":"address"},{"indexed":true,"name":"fromPerson","type":"address"},{"indexed":false,"name":"transactionHash","type":"bytes32"},{"indexed":false,"name":"payment","type":"uint256"},{"indexed":false,"name":"comment","type":"string"},{"indexed":false,"name":"trustbrokers","type":"address[]"}],"name":"sendMoneyEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"transactionHash","type":"bytes32"},{"indexed":false,"name":"trustbroker","type":"address"},{"indexed":false,"name":"comment","type":"string"}],"name":"transactionApproved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"transactionHash","type":"bytes32"},{"indexed":false,"name":"trustbroker","type":"address"},{"indexed":false,"name":"comment","type":"string"}],"name":"transactionRejected","type":"event"}];

	// set provider for all later instances to use
	if (typeof web3 !== 'undefined') {
		var web3 = new Web3(web3.currentProvider);
	} else {
		var web3 = new Web3(Web3.givenProvider || 'ws://localhost:8546');
	}

	// check gas limit
//	var blk = web3.eth.getBlock("latest").then(console.log);

	var data = req.body;
	var gas_Price;

	// create account from private key
	var account = web3.eth.accounts.privateKeyToAccount( '0x'+data.private );
	web3.eth.accounts.wallet.add(account);

	/* contract ABI */
	var contract = new web3.eth.Contract(abiArray, contractAddress);
	if (typeof contract == 'undefined') {
		console.log('Error creating contract');
		return;
	}

	web3.eth.getGasPrice()
		.then( function(val) {
		gas_Price = web3.utils.toBN(val);
		console.log('gas price: '+gas_Price.toString(10));

	console.log(data);

	web3.eth.getBalance(account.address)
		.then( function(data, err) {
			console.log('acc data:'+data);
			console.log('acc error:'+err);
		});

	var gas_Limit = web3.utils.toBN(data.gas_limit);
	var gas_Amount = gas_Price.mul( gas_Limit );
	var valToTransfer = web3.utils.toBN(data.value).sub(gas_Amount);

	if (valToTransfer.isNeg()) { // for now, just set it to 0
		valToTransfer = web3.utils.toBN( 0 );
	}

	console.log('Sending money: '+valToTransfer.toString()+"["+gas_Limit.toString(10)+"]");

	contract.methods.sendMoney(data.toPerson, data.comment, [])
		.send({ from: account.address, gas: gas_Limit.toString(10), value: valToTransfer.toString(10) })
		.on('transactionHash', function(hash) {
			console.log('TxHash:'+hash);
			res.send(hash);
		})
		.on('confirmation', function(confirmationNumber, receipt) {
			console.log('Confirm:'+confirmationNumber +", rcpt" + receipt);
			res.send('confirm:' + confirmationNumber);
		})
		.on('receipt', function(receipt) {
		    // receipt example
		    console.log('Rcpt:' + receipt);
			res.send(receipt);
		})
		.on('error', function(error) {
				console.log('Error:' + error);
				res.status(500).send('Error occured:'+error);
		}); // If there's an out of gas error the second parameter is the receipt.
	});
}

exports.estimateGas = function(req,res) {
	var Web3 = require('web3');
	var contractAddress = '0x4eff9837ebd42827edbadbcfec8c7b4f9e5b0d39';
	var abiArray = [{"constant":false,"inputs":[{"name":"_address","type":"address"}],"name":"getRating","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"transactionHash","type":"bytes32"}],"name":"rollbackvOverdueTransaction","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"balance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"toPerson","type":"address"},{"name":"comment","type":"string"},{"name":"trustbrokers","type":"address[]"}],"name":"sendMoney","outputs":[{"name":"","type":"bytes32"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"transactionHash","type":"bytes32"},{"name":"comment","type":"string"}],"name":"provideValidation","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"transactionHash","type":"bytes32"}],"name":"receiveMoney","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"toPerson","type":"address"},{"indexed":true,"name":"fromPerson","type":"address"},{"indexed":false,"name":"transactionHash","type":"bytes32"},{"indexed":false,"name":"payment","type":"uint256"},{"indexed":false,"name":"comment","type":"string"},{"indexed":false,"name":"trustbrokers","type":"address[]"}],"name":"sendMoneyEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"transactionHash","type":"bytes32"},{"indexed":false,"name":"trustbroker","type":"address"},{"indexed":false,"name":"comment","type":"string"}],"name":"transactionApproved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"transactionHash","type":"bytes32"},{"indexed":false,"name":"trustbroker","type":"address"},{"indexed":false,"name":"comment","type":"string"}],"name":"transactionRejected","type":"event"}];

	// set provider for all later instances to use
	if (typeof web3 !== 'undefined') {
	  var web3 = new Web3(web3.currentProvider);
	} else {
      var web3 = new Web3(Web3.givenProvider || 'ws://localhost:8546');
	}

	var data = req.body;
	console.log(data);

	// create account from private key
	var account = web3.eth.accounts.privateKeyToAccount( '0x'+data.private );
	web3.eth.accounts.wallet.add(account);

	/* contract ABI */
	var contract = new web3.eth.Contract(abiArray, contractAddress);

	if (typeof contract == 'undefined') {
		console.log('Error creating contract');
		return;
	}

	contract.methods.sendMoney( data.toPerson, data.comment, [] )
		.estimateGas({ gas: 5000000 },
			function(error, gasAmount) {
				if (null!==error) {
					console.log('error:' + error);
					res.status(500).send('Error occured:'+error);
					return;
				} else {
			        console.log('gas:' + gasAmount);
					res.send( gasAmount );
				}
	});
}