
var app = require('express')();
var path = require('path')
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var five = require("johnny-five");
var TestRPC = require("ethereumjs-testrpc");
var Web3 = require('web3')
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
web3.setProvider(TestRPC.provider());

// import 同目錄的 eventEmitter.js
var eventEmitter = require('./eventEmitter.js')

// import 同目錄的 web3.js
//var web3 = require('./web3.js')
var eth = web3.eth

// import 同目錄的 lock
var lock = require('./LockContract.js')

// Express.js
var express = require('express')
//var app = express()

// 讓 req 有 body
var bodyParser = require('body-parser')

// 使 static 中的檔案能被讀取
app.use(express.static(path.resolve(__dirname, 'static')))

// 註冊 body-parser 處理 body stream
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: true
}))

//windows
/*var board  = new five.Board({
	port : "COM4"
});*/
//mac
var board = new five.Board({
	port: "/dev/cu.usbmodem1421",
	repl: false
});

var Led; 
var Relay;
//var server = app.listen(3000);
/*
server.listen(process.env.PORT || 3000, function () {
	console.log('listening on *:3000');
});
*/
server.listen(3000);


// ?a=address
app.get('/account', function (req, res) {
	var account = req.query.a

	// 先取得 etherBalance
	eth.getBalance(account, function (err, ethBalance) {
		if (!err) {
			// 再取得 bank balance
			// { from: account } 為 tx object
			lock.checkBankBalance({
				from: account
			}, function (err, bankBalance) {
				if (!err) {
					// 回傳 json
					res.json({
						address: account,
						ethBalance: ethBalance,
						bankBalance: bankBalance
					})
				} else {
					console.log(err)
					res.status(500).json(err)
				}
			})
		} else {
			console.log(err)
			res.status(500).json(err)
		}
	})
})

// 取得以太帳戶們
app.get('/accounts', function (req, res) {
	eth.getAccounts(function (err, accounts) {
		if (!err) {
			res.json(accounts)
		} else {
			console.log(err)
			res.status(500).json(err)
		}
	})
})
// ?a=address&e=etherValue
app.post('/deposit', function (req, res) {
	var account = req.query.a
	var value = parseInt(req.query.e, 10)

	// 存款
	// 而 deposit 雖然本身沒有 args，但是需要透過描述 tx object 來達成送錢與表明自己的身分 (以哪個帳戶的名義)
	lock.deposit({
		from: account,
		value: web3.toWei(value, 'ether'),
		gas: 4600000
	}, function (err, txhash) {
		if (!err) {
			// 當 eventEmitter 收到事件描述之後，只會觸發一次以下的 callback
			eventEmitter.once('DepositEvent:' + account, function (eventPayload) {
				// 增加 txhash 欄位
				eventPayload['txhash'] = txhash
					// 並回傳 json
				res.json(eventPayload)
			})
		} else {
			console.log(err)
			res.status(500).json(err)
		}
	})
})

// ?a=address&e=etherValue
app.get('/withdraw', function (req, res) {
	var account = req.query.a
	var etherValue = parseInt(req.query.e, 10)

	// 提款
	// withdraw 本身只有一個 args，而 { from: account, gas: ...  } 為 tx object
	lock.withdraw(etherValue, {
		from: account,
		gas: 4600000
	}, function (err, txhash) {
		if (!err) {
			// 當 eventEmitter 收到事件描述之後，只會觸發一次以下的 callback
			eventEmitter.once('WithdrawEvent:' + account, function (eventPayload) {
				// 增加 txhash 欄位
				eventPayload['txhash'] = txhash
					// 並回傳 json
				res.json(eventPayload)
			})
		} else {
			console.log(err)
			res.status(500).json(err)
		}
	})
})
// ?f=address&t=address&e=etherValue
app.post('/transfer', function (req, res) {
	var from = req.query.f
	var to = req.query.t
	var etherValue = parseInt(req.query.e, 10)

	// 提款
	// withdraw 本身有兩個 args，而 { from: from, gas: ... } 為 tx object
	lock.transfer(to, etherValue, {
		from: from,
		gas: 4600000
	}, function (err, txhash) {
		if (!err) {
			// 當 eventEmitter 收到事件描述之後，只會觸發一次以下的 callback
			eventEmitter.once('TransferEvent:' + from, function (eventPayload) {
				// 增加 txhash 欄位
				eventPayload['txhash'] = txhash
				Led.on();
				Relay.off();
				setTimeout(function() {
   					Relay.on();
   					Led.off();	  
				}, 300);
				 
				
				// 並回傳 json
				res.json(eventPayload)
			})
		} else {
			console.log(err)
			res.status(500).json(err)
		}
	})
})

// 網址為根目錄時，預設回傳 index.html
app.get('/', function (req, res) {
	res.sendFile(path.resolve(__dirname, 'static', 'index.html'))
})
// 沒有對應到任何 path 時，回傳 404
app.use(function (req, res) {
	res.status(404).send('not found')
})
/*
 board.on("ready", function () {
		console.log("board ready");

		Led = new five.Led(13);
		Relay = new five.Relay(8);

		// init
		Led.off();
		Relay.off();
		let button = document.getElementById("UnlockButton");
		button.addEventListener('click', () => {
  			Led.on();
			Relay.off();
		});
		
	/*	$('#LockButton').on('click',function(){
			Led.off();
			Relay.on();

		})


});
*/
 
board.on("ready", function () {
	console.log("board ready");

	Led = new five.Led(13);
	Relay = new five.Relay(8);

	// init
	Led.off();
	Relay.on();

	io.on('connection', function (socket) {
		socket.emit('news', 'hi');
		socket.on('event', function (data) {
	
			var message;

			if (data == 0) {//unlock
				// console.log("unlock");
				Led.on();
				Relay.off();
				message = 'unlock LED 亮';

				//LockContract.transfer
			}
			else {//lock
				// console.log("lock");
				Led.off();
				Relay.on();
				message = 'lock LED 滅';
			}
			socket.emit('log',message);
			console.log(message);
			
		});
	});

});

//app.listen(1336)


