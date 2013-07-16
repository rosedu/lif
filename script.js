$(document).ready(function(){
	$.ajaxSetup({
		url: 'ajax.php',
		dataType: 'text',
		type: 'POST'
	});
});

var ChangeHash;

$(document).ready(function(){		//retrieve curent hash from server
	$.ajax({
		data: 'action=getHash',
		dataType: 'json',
		success	: function(response){
			ChangeHash = response.hash;
			setTimeout(Refresh,2000);
		}
	});
});

$(document).ready(function(){
	if($('title').text() == 'Statistics') {
		var ratio = screen.width/screen.height;
		if(ratio < 1.4)	// 4:3
			$('body').css('background-image','url("images/4_3_stats.jpg")');
		else
			$('body').css('background-image','url("images/16_9_stats.jpg")');
	}
});

function formHash() {	//the hash to be sent to the server when a change is made
	var date = new Date();
	var miliseconds = date.getMilliseconds();
	return MD5(miliseconds.toString());
}

function GetUpdate(type){
	$(document).ready(function(){
		$.ajax({
			data: 'action=getUpdates&type='+type,
			complete: function(response){
				var json = $.parseJSON(response.response);
				switch(type) {	
					case "0": {
						$('div#participant').html(json.string);
						break;
					}
					case "1": {
						$('div#helper').html(json.string);
						break;
					}
					case "2": {
						$('div#helper').html(json.helper);
						$('div#participant').html(json.participant);
						break;
					}
				}
				setTimeout(2000,Refresh());
			}
		});
	});
}

function Refresh() {
	$(document).ready(function(){
		if($('title').text() == 'Statistics')	
			$.ajax({
				data: 'action=checkStats&hash='+ChangeHash,
				complete: function(response){
					var json = $.parseJSON(response.response);
					if(json != null)
						if(json.no_change === undefined) {
							$('#stats').html(json.html);
							ChangeHash = json.hash;
						}
					setTimeout(Refresh,2000);
				}	
			});
		else
			$.ajax({
				data: 'action=checkChanges&hash='+ChangeHash,
				complete: function(response) {
					var json = $.parseJSON(response.response);
					if(json != null)
						if(json.hash != undefined){		//there's a change from a user
						//alert("We have changes: "+json.hash+ " = "+ChangeHash);
							GetUpdate(json.type);
							ChangeHash = json.hash;
						}
					setTimeout(Refresh,2000);
				}
			});
	});

}

function Register() {
	$(document).ready(function(){
		var type = $('#type option:selected').val();
		var name = $('#name').val();
		var distro = $('#distro').val();
		var hash = formHash();
		
		if(distro != "" && type == '0')
			var data_string = 'action=register&type='+type+'&name='+name+'&distro='+distro+'&hash='+hash;
		else if (type == '1')
			var data_string = 'action=register&type='+type+'&name='+name+'&hash='+hash;
		else
			return;
		if(name=="")
			return;

		$.ajax({
			data: data_string,
			complete: function(response){
				$('input#name').val('');
				$('input#distro').val('');
			}
		});
	});
}

function clearAllSelectedRows() {
	var elements = $('tr[selected="selected"]');
	elements.removeAttr('selected');
	elements.css('background-color','');
}

function SelectRow(type,id) {
	$(document).ready(function(){
		var row = $('#'+type+id);
		
		if(type=="helper") { //this condition is checked only when helpers are being selected
			var selectedRow = $('[id^=helper][selected="selected"]');
			
			if(selectedRow.length == 1) {
				selectedRow.attr('selected','');
				selectedRow.css('background-color','');
				row.attr('selected','selected');
				row.css('background-color','yellow');
				return null;
			}
		}
		
		if(row.attr('selected') == undefined) {	//select
			row.attr('selected','selected');
			row.css('background-color','yellow');
		}
		else {									//deselect
			row.removeAttr('selected');
			row.css('background-color','');
		}
		
	});
}

function AssignHelpers() {
	$(document).ready(function(){
		var selectedHelper = GetSelectedHelperId()
		var selectedParticipants = $('[id^=part][selected="selected"]');
		
		if(!IsSelected())
			return null;
		
		var hash = formHash();
		
		var storedParticipants = [];
		selectedParticipants.each(function(index,element){
			storedParticipants[index] = element.id.slice(4); 
		});
		
		$.ajax({
			data: 'action=assign&helper='+selectedHelper+'&participants='+storedParticipants+'&hash='+hash
		});
		clearAllSelectedRows();
	});
}

function CompleteInstallation(){
	$(document).ready(function(){
		var pid = $('[id^=part][selected="selected"]');
		id = pid.attr('id').slice(4);
		var comment = $('#comment').attr('value');
		var hash = formHash();

		$.ajax({
			data: 'action=completeInstall&ID='+id+'&hash='+hash+'&comment='+comment,
			complete: function(){
				RemoveCommentBox();
			}
		});
	});
}


function GetCommentBox() {
	$(document).ready(function(){
		if(CheckCompleteButton() == null)
			return false;

		var floatbox = document.createElement('div');
		floatbox.setAttribute('class', 'comment_box');
		//floatbox.appendChild(document.createTextNode('<br />'));
		
		var input_field = document.createElement('textarea');
		input_field.setAttribute('rows', '10');
		input_field.setAttribute('cols', '40');
		input_field.setAttribute('id', 'comment');
		floatbox.appendChild(input_field);
		
		var button = document.createElement('input');
		button.setAttribute('type', 'button');
		button.setAttribute('value', 'OK');
		button.addEventListener('click', CompleteInstallation);
		floatbox.appendChild(button);
		
		var close = document.createElement('a');
		close.setAttribute('href', '#');
		close.style.position = 'absolute';
		close.style.top = '0';
		close.style.right = '0';
		close.innerHTML = '[X]';
		close.addEventListener('click', RemoveCommentBox);
		floatbox.appendChild(close);
		
		
		$('body').append(floatbox);
		//$('.comment_box').hide();
		$('.comment_box').hide();
		$('.comment_box').show(1000);
	});
}

function GetLoginBox() {
	$(document).ready(function(){
		var floatbox = document.createElement('div');
		floatbox.setAttribute('class', 'login_box');
		
		var name_p = document.createElement('p');
		name_p.style.display = 'inline';
		name_p.style.fontFamily = 'Georgia';
		name_p.innerHTML = 'Username: ';
		var name_input = document.createElement('input');
		name_input.setAttribute('type', 'text');
		name_input.setAttribute('size', '20');
		name_input.setAttribute('id', 'username');
		name_input.style.position = 'absolute';
		name_input.style.left = '80px';
		name_p.appendChild(name_input);
		floatbox.appendChild(name_p);
		floatbox.appendChild(document.createElement('br'));
		
		var password_p = document.createElement('p');
		password_p.style.display = 'inline';
		password_p.style.fontFamily = 'Georgia';
		password_p.innerHTML = 'Password: ';
		var password_input = document.createElement('input');
		password_input.setAttribute('type', 'password');
		password_input.setAttribute('size', '20');
		password_input.setAttribute('id', 'password');
		password_input.style.position = 'absolute';
		password_input.style.left = '80px';
		password_p.appendChild(password_input);
		floatbox.appendChild(password_p);
		floatbox.appendChild(document.createElement('br'));
		floatbox.appendChild(document.createElement('br'));
		
		var submit_button = document.createElement('input');
		submit_button.setAttribute('type', 'button');
		submit_button.setAttribute('value', 'Submit');
		submit_button.addEventListener('click', LDAP_login);
		floatbox.appendChild(submit_button);

		var close_anchor = document.createElement('a');
		close_anchor.setAttribute('href','#');
		close_anchor.style.position = 'relative';
		close_anchor.style.left = '60%';
		close_anchor.innerHTML = "[X]";
		close_anchor.addEventListener('click', CloseLoginBox);
		floatbox.appendChild(close_anchor);
		
		$('body').append(floatbox);
		$('.login_box').hide();
		$('.login_box').show(1000);
		
	});
}

function LDAP_login() {
	$(document).ready(function(){
		var username_el = $('#username');
		var password_el = $('#password');
		if(username_el.val() && password_el.val()) {
			var name = username_el.val();
			var pword = password_el.val();
			$.ajax({
				data: 'action=ldap_login&username='+name+'&password='+pword,
				complete: function(response){
					if(response.response == "Login Successful")
						window.location = "/admin.php";
					alert(response.response);
				}
			});
		}
	});
}

function Unassign() {
	$(document).ready(function(){
		var hid = GetSelectedHelperId();
		var pid = $('[id^=part][selected="selected"]');
		if(hid == null || pid.length == 0 || pid.length > 1 || $('[id^=part][selected="selected"] > :nth-child(3)').attr('assigned') == undefined )
			return null;
		var pid = pid.attr('id').slice(4);
		var hash = formHash();
		$.ajax({
			data: 'action=unassign&hid='+hid+'&pid='+pid+'&hash='+hash,
			complete: function(response){
				clearAllSelectedRows();
			}
		});
	});
}

function Delete() {
	$(document).ready(function(){
		var hid = GetSelectedHelperId();
		var pid = $('[id^=part][selected="selected"]');
		if (pid.length > 1) return null;
		if (hid == null && pid.length == 1) {
			var id = pid.attr('id').slice(4);
			var type = 'participant';
		}
		else if (hid != null && pid.length == 0){
			var id = hid;
			var type = 'helper';
		}
		else return null;
		//alert('not functional yet');
		var hash = formHash();

		$.ajax({data: 'action=delete&id='+id+'&type='+type+'&hash='+hash});
	});
}

function CloseLoginBox(){
	$(document).ready(function(){
		$('.login_box').fadeOut(1000);
		setTimeout(function(){$('.login_box').remove();},1000);
	});
}

function ToggleAway() {
	$(document).ready(function(){
		var helper_id = GetSelectedHelperId();
		var hash = formHash();
		
		if(helper_id == null)
			return null;
		
		var CurrentState = $('#helper'+helper_id).children('td').eq(1).text();
		var state;
		if(CurrentState == 'Unavailable')
			state = '0';
		else state = '1';
		
		$.ajax({
			data: 'action=toggleAway&id='+helper_id+'&state='+state+'&hash='+hash
		});
	});
}

function GetSelectedHelperId() {
	var helper = $('[id^=helper][selected="selected"]');
	if(helper.length)
		return helper.attr('id').slice(6);
	return null;
}

function RemoveCommentBox() {
	$(document).ready(function(){
		$('.comment_box').fadeOut(1000);
		setTimeout(function(){$('.comment_box').remove();},1000);
	});
}

function IsSelected() {
	var selected = true;
	$(document).ready(function(){
		var selectedHelper = $('[id^=helper][selected="selected"]');
		var selectedParticipants = $('[id^=part][selected="selected"]');
		
		if(selectedHelper.length == 0 || selectedParticipants.length == 0)
			selected = false;
	});
	return selected;
}

function CheckCompleteButton() {
	var result = null;
	$(document).ready(function(){
		var participant = $('[id^=part][selected="selected"]');
		if (participant.length != 1)
			return null;
		if ($('[id^=part][selected="selected"] > :nth-child(3)').attr('assigned') == undefined)//it doesn't have a helper assigned
			return null;
		if($('.comment_box').length == 1)
			return null;
		result = true;
	});
	return result;
}

var MD5 = function(string) {
	 
	function RotateLeft(lValue, iShiftBits) {
		return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
	}
 
	function AddUnsigned(lX,lY) {
		var lX4,lY4,lX8,lY8,lResult;
		lX8 = (lX & 0x80000000);
		lY8 = (lY & 0x80000000);
		lX4 = (lX & 0x40000000);
		lY4 = (lY & 0x40000000);
		lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
		if (lX4 & lY4) {
			return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
		}
		if (lX4 | lY4) {
			if (lResult & 0x40000000) {
				return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
			} else {
				return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
			}
		} else {
			return (lResult ^ lX8 ^ lY8);
		}
 	}
 
 	function F(x,y,z) { return (x & y) | ((~x) & z); }
 	function G(x,y,z) { return (x & z) | (y & (~z)); }
 	function H(x,y,z) { return (x ^ y ^ z); }
	function I(x,y,z) { return (y ^ (x | (~z))); }
 
	function FF(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};
 
	function GG(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};
 
	function HH(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};
 
	function II(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};
 
	function ConvertToWordArray(string) {
		var lWordCount;
		var lMessageLength = string.length;
		var lNumberOfWords_temp1=lMessageLength + 8;
		var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
		var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
		var lWordArray=Array(lNumberOfWords-1);
		var lBytePosition = 0;
		var lByteCount = 0;
		while ( lByteCount < lMessageLength ) {
			lWordCount = (lByteCount-(lByteCount % 4))/4;
			lBytePosition = (lByteCount % 4)*8;
			lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
			lByteCount++;
		}
		lWordCount = (lByteCount-(lByteCount % 4))/4;
		lBytePosition = (lByteCount % 4)*8;
		lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
		lWordArray[lNumberOfWords-2] = lMessageLength<<3;
		lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
		return lWordArray;
	};
 
	function WordToHex(lValue) {
		var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
		for (lCount = 0;lCount<=3;lCount++) {
			lByte = (lValue>>>(lCount*8)) & 255;
			WordToHexValue_temp = "0" + lByte.toString(16);
			WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
		}
		return WordToHexValue;
	};
 
	function Utf8Encode(string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	};
 
	var x=Array();
	var k,AA,BB,CC,DD,a,b,c,d;
	var S11=7, S12=12, S13=17, S14=22;
	var S21=5, S22=9 , S23=14, S24=20;
	var S31=4, S32=11, S33=16, S34=23;
	var S41=6, S42=10, S43=15, S44=21;
 
	string = Utf8Encode(string);
 
	x = ConvertToWordArray(string);
 
	a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
 
	for (k=0;k<x.length;k+=16) {
		AA=a; BB=b; CC=c; DD=d;
		a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
		d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
		c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
		b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
		a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
		d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
		c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
		b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
		a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
		d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
		c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
		b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
		a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
		d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
		c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
		b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
		a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
		d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
		c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
		b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
		a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
		d=GG(d,a,b,c,x[k+10],S22,0x2441453);
		c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
		b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
		a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
		d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
		c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
		b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
		a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
		d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
		c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
		b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
		a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
		d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
		c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
		b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
		a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
		d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
		c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
		b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
		a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
		d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
		c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
		b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
		a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
		d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
		c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
		b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
		a=II(a,b,c,d,x[k+0], S41,0xF4292244);
		d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
		c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
		b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
		a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
		d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
		c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
		b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
		a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
		d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
		c=II(c,d,a,b,x[k+6], S43,0xA3014314);
		b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
		a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
		d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
		c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
		b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
		a=AddUnsigned(a,AA);
		b=AddUnsigned(b,BB);
		c=AddUnsigned(c,CC);
		d=AddUnsigned(d,DD);
	}
 
	var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);
 
	return temp.toLowerCase();
}
