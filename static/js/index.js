var lock
var whoami
var whoamiButton
var ethBalance
var bankBalance
var logger
var transferTo
var transferEtherValue
var transferButton
var UnlockButton
var LockButton
var deposit
var depositButton
var withdraw
var withdrawButton
var logger
// var five = require("johnny-five");
// var board = new five.Board({
// 	port: "/dev/cu.usbmodem1421",
// 	repl: false
// });

// var Led; 
// var Relay;
	/*	function log(input) {

			document.getElementById("log").textContent += input + '\n';

		}
*/
// AJAX GET 方法
function GET(url, callback, failback) {
	return jQuery
		.ajax(url, {
			method: 'GET',
			cache: false,
			crossDomain: false
		})
		.done(callback)
		.fail(failback)
}

// AJAX POST 方法
function POST(url, data, callback, failback) {
	return jQuery
		.ajax(url, {
			method: 'POST',
			cache: false,
			data: data,
			crossDomain: false
		})
		.done(callback)
		.fail(failback)
}

/*function tran() {
			
			var socket = io.connect('http://127.0.0.1:1336');
			socket.on('news', function(data) {
				console.log(data);
				if (data === 'TRUE') {
					//OK
				};
				if (data === 'hi') {
					console.log("lock = " + lock);
					socket.emit('event', lock);
					socket.on('log', function(message) {
						console.log("log = " + message);
						log(message);
					});
				};
			});

		}*/
	function log(input) {
		if (typeof input === 'object') {
			input = JSON.stringify(input, null, 2)
		}
		logger.html(input + '\n' + logger.html())
	}
// 載入網頁之後
$(function () {
	// 以 jQuery 抓取元素們
	whoami = $('#whoami')
	whoamiButton = $('#whoamiButton')
	transferTo = $('#transferTo')
	transferEtherValue = $('#transferEtherValue')
	transferButton = $('#transferButton')
	logger = $('#logger')
	ethBalance = $('#ethBalance')
	bankBalance = $('#bankBalance')
	LockButton = $('#LockButton')
	UnlockButton = $('#UnlockButton')
	deposit = $('#deposit')
	depositButton = $('#depositButton')
	withdraw = $('#withdraw')
	withdrawButton = $('#withdrawButton')
	
	console.log("test");

	LockButton.on('click',function(){
		lock = 0;
		//tran();
		log("上鎖");
		console.log("lock");
	})
	UnlockButton.on('click',function(){
		lock = 1;
		//tran();
		log("開鎖");
		console.log("unlock");
	})
	whoamiButton.on('click', function () {
		// GET account?a=address
		GET('./account?a=' + whoami.val(),
			function (res) {
				// 更新活動紀錄
				log(res)
				log('更新帳戶資料')

				// 更新介面
				ethBalance.text('以太帳戶餘額 (wei): ' + res.ethBalance)
				bankBalance.text('銀行合約餘額 (wei): ' + res.bankBalance)
			},
			function (res) {
				log(res.responseText
					.replace(/\<br\>/g, '\n')
					.replace(/\&nbsp;/g, ' '))
				log('請檢查帳戶及銀行合約餘額')
			})
	})
	// 當按下存款按鍵時
	depositButton.on('click', function () {
		// POST deposit?a=address&e=etherValue
		POST('./deposit?a=' + whoami.val() + '&e=' + deposit.val(), {},
			function (res) {
				log(res)
				log('存款成功')

				// 觸發更新帳戶資料
				whoamiButton.trigger('click')
			},
			function (res) {
				log(res.responseText
					.replace(/\<br\>/g, '\n')
					.replace(/\&nbsp;/g, ' '))
				log('請檢查帳戶及銀行合約餘額')
			})
	})

	// 當按下提款按鍵時
	withdrawButton.on('click', function () {
		// GET withdraw?a=address&e=etherValue
		GET('./withdraw?a=' + whoami.val() + '&e=' + withdraw.val(),
			function (res) {
				// 更新活動紀錄
				log(res)
				log('提款成功')

				// 觸發更新帳戶資料
				whoamiButton.trigger('click')
			},
			function (res) {
				log(res.responseText
					.replace(/\<br\>/g, '\n')
					.replace(/\&nbsp;/g, ' '))
				log('請檢查帳戶及銀行合約餘額')
			})
	})

	// 當按下轉帳按鍵時
	transferButton.on('click', function () {
		// POST transfer?f=address&t=address&e=etherValue
		POST('./transfer?f=' + whoami.val() + '&t=' + transferTo.val() + '&e=' + transferEtherValue.val(), {},
			function (res) {
				// 更新活動紀錄
				log(res)
				log('轉帳成功')

				// 觸發更新帳戶資料
				whoamiButton.trigger('click')
			},
			function (res) {
				log(res.responseText
					.replace(/\<br\>/g, '\n')
					.replace(/\&nbsp;/g, ' '))
				log('請檢查帳戶及銀行合約餘額')
			})
	})
/*
	board.on("ready", function () {
		console.log("board ready");

		Led = new five.Led(13);
		Relay = new five.Relay(8);

		// init
		Led.off();
		Relay.off();
		UnlockButton.on('click', function(){
			Led.on();
			Relay.off();

		})
		LockButton.on('click',function(){
			Led.off();
			Relay.on();

		})

	/*io.on('connection', function (socket) {
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
	*/
	})


