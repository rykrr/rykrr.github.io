// Work in progress             //
// Copyright (c) Ryan Kerr 2025 //

var line;

function init() {
	var date = new Date(Date.now()).toLocaleString("en-CA", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric"
	});
	var datestamp = document.getElementById("datestamp");
	datestamp.innerHTML = date;
}

async function init2() {
	var animate = (getCookie('animate') == undefined);
	var s = animate? 1 : 0;
	setCookie('animate', 'true', 16);
	await (new Promise((r) => text('name',  'Ryan H. Kerr', 0, 100 * s, 0, r)));
	
	input();
}

function setCookie(key, val, mins) {
	var date = new Date();
	date.setTime(date.getTime() + (mins * 1000 * 60));
	document.cookie = key + '=' + val + ';' + 'expires=' + date.toUTCString();
}

function getCookie(key) {
	var cookies = document.cookie.split(';');
	
	for(i in cookies) {
		var cookie = cookies[i];
		
		if(cookie.indexOf(key + '=') == 0)
			return cookie.substring(key.length+1, cookie.length);
	}
	
	return undefined;
}

function delay(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

async function text(id, text, startDelay, textDelay, endDelay, resolve) {
	var name = $('#' + id + '.text');
	var curs = $('#' + id + '.cursor');
	var line = '';
	
	curs.toggleClass('hide');
	curs.toggleClass('blink');
	await delay(startDelay);
	
	curs.toggleClass('blink');
	for(c in text) {
		line += text[c];
		name.text(line);
		
		if(text[c] != ' ')
			await delay(textDelay);
	}
	
	if(endDelay == 0) {
		curs.toggleClass('hide');
	}
	else {
		curs.toggleClass('fade');
		await delay(endDelay);
	}
	
	resolve();
}

const br = $('<br>');

function span(cls) {
	return $('<span></span>').toggleClass(cls);
}

function append_to_terminal(elements) {
	var terminal = $('#terminal');

	for (element in elements) {
		terminal.append(elements[element]);
	}
}

function input() {
	line = {
		prompt: span('prompt').text('> '),
		text: span('input').prop('contenteditable', true),
		cursor: span('cursor').toggleClass('blink').text('_'),
	};

	line.text.on('keydown', (e) => {
		line.cursor.toggleClass('blink');
		
		if(line.text.text().length > 32 && e.keyCode != 8)
			return false;
		
		if(e.keyCode == 39 || e.keyCode == 37)
			return false;
	});
	
	line.text.on('keyup', (e) => {
		if(e.keyCode == 13) {
			line.text.prop('contenteditable', false);
			line.text.off('keyup');
			line.cursor.toggleClass('blink').text('');
			//append_to_terminal([br]);
			//exec(line.text.text());
			input();
		}
		else {
			line.cursor.toggleClass('blink');
		}
	});

	append_to_terminal([line.prompt, line.text, line.cursor]);
	line.text.focus();
}
