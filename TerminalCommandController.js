const { getLeftWordIndex, getRightWordIndex, removeByIndex, insert } = require('./SRC/utils/utils');

// Terminal Command Controller
module.exports = class TCC {
	constructor() {
		this.stdinVal = "";
		this.col = 0;
		this.defaultCommandPrefix = "";
		this.CMD = null;

		this.stdinEmmiter = null;
	}
	ClearConsole() {
		console.clear()
	}
	InitInput(rawMode) {
		process.stdin.setRawMode(rawMode);
		process.stdin.resume();
		process.stdin.setEncoding('utf-8');
	}
	ClearLine() {
		process.stdout.write("\r\x1b[K");
	}
	WriteCommand(cmd) {
		process.stdout.write( `${this.defaultCommandPrefix}${cmd }`)
	}
	Write(text) {
		process.stdout.write(text)
	}
	CursorTo(pos) {
		process.stdout.cursorTo(pos);
	}
	Print(...text) {
		console.log(...text);
	}
	SetStdinListener(lName, func) {
		this.stdinEmmiter.on(lName, func);
	}
	RemoveStdinListener(lName, func) {
		this.stdinEmmiter.removeListener(lName, func);
	}
	commandRender(inputStdin) {
		let setCommand = (cmd) => {
			this.col = cmd.length;
			this.ClearLine();
			this.WriteCommand(cmd);
			this.stdinVal = cmd;
		}
		function toUnicode(theString) {
		  var unicodeString = '';
		  for (var i=0; i < theString.length; i++) {
		    var theUnicode = theString.charCodeAt(i).toString(16).toUpperCase();
		    while (theUnicode.length < 4) {
		      theUnicode = '0' + theUnicode;
		    }
		    theUnicode = '\\u' + theUnicode;
		    unicodeString += theUnicode;
		  }
		  return unicodeString;
		}
		// console.log(toUnicode(inputStdin))
		switch(inputStdin) {
			case "\u0003":
				process.stdout.write("\n");
				process.exit();
				return 1;
			case "\u000D":
				this.CursorTo(this.stdinVal.length-1);
				this.Write("\n");
				this.col = 0;
				this.CMD._historyPos = -1;
				return 1;
			case "\u001B\u004F\u004D":
				// console.log(123)
				break;
			case "\u001b[A":
				if(this.CMD._historyPos != this.CMD.commandHistory.length-1) {					
					this.CMD._historyPos += 1;
					setCommand(this.CMD.commandHistory[this.CMD.commandHistory.length-1 - this.CMD._historyPos]??"")
				}
				break;
			case "\u001b[B":
				if(this.CMD._historyPos != -1){
					this.CMD._historyPos -= 1;
					setCommand(this.CMD.commandHistory[this.CMD.commandHistory.length-1 - this.CMD._historyPos]??"")
				}
				break;
			case "\u001b[C":
				if(this.col < this.stdinVal.length) {
					this.col += 1;
					process.stdout.write("\u001b[C");
				}
				break;
			case "\u001b[D":
				if(this.col == 0){
					process.stdout.cursorTo(this.defaultCommandPrefix.length);
					return 0;
				}
				this.col -= 1;
				process.stdout.write("\u001b[D");
				break;
			case "\u001b[3~":
				this.stdinVal = removeByIndex(this.stdinVal, this.col);
				this.ClearLine();
				this.WriteCommand(this.stdinVal.replace("\r", "").replace("\n", ""));
				process.stdout.cursorTo(this.col + this.defaultCommandPrefix.length);
				break;	
			case "\x7F":
				if(this.col == 0) {
					break;
				}
				this.stdinVal = removeByIndex(this.stdinVal, this.col-1);
				this.ClearLine();
				this.WriteCommand(this.stdinVal.replace("\r", "").replace("\n", ""));

				this.col -= 1;
				process.stdout.cursorTo(this.col + this.defaultCommandPrefix.length);
				break;
			case "\\x7F":
			break;						
			case "\b":
				(()=> {
					const delCount = this.col - (getLeftWordIndex(this.stdinVal, this.col)-1 > 0? getLeftWordIndex(this.stdinVal, this.col)-1: 0);
					this.stdinVal = this.stdinVal.slice(0, (getLeftWordIndex(this.stdinVal, this.col)-1 > 0? getLeftWordIndex(this.stdinVal, this.col)-1: 0)) + this.stdinVal.slice(this.col, this.stdinVal.length);
					this.col -= delCount;
					this.ClearLine();
					this.WriteCommand(this.stdinVal.replace("\r", "").replace("\n", ""));
				})()
				process.stdout.cursorTo(this.col + this.defaultCommandPrefix.length);
			break;				
			case "\x1B[3;5~":
				// (()=> {
				// 	const delCount = (getLeftWordIndex(this.stdinVal, this.col)-1 > 0? getLeftWordIndex(this.stdinVal, this.col)-1: 0) - this.col;
				// 	this.stdinVal = this.stdinVal.slice(0, this.col) + this.stdinVal.slice(getRightWordIndex(this.stdinVal, this.col), this.stdinVal.length);
				// 	this.col -= delCount;
				// 	process.stdout.write("\r\x1b[K");
				// 	process.stdout.write( `${this.defaultCommandPrefix}${this.stdinVal.replace("\r", "").replace("\n", "")}` );
				// 	process.stdout.cursorTo(this.col + this.defaultCommandPrefix.length);
				// })()
			break;
			case "\x1B[1;5D":
				this.col = getLeftWordIndex(this.stdinVal, this.col)-1 > 0? getLeftWordIndex(this.stdinVal, this.col)-1: 0;
				process.stdout.cursorTo(this.col + this.defaultCommandPrefix.length);
			break; 
			case "\x1B[1;5C":
				if(this.col < this.stdinVal.length) {					
					this.col = getRightWordIndex(this.stdinVal, this.col);
					process.stdout.cursorTo(this.col + this.defaultCommandPrefix.length);
				}
				// this.col += this.col - ;
				// process.stdout.cursorTo(wordIndexByTextIndex(this.stdinVal.split(" "), this.col, 1) + this.defaultCommandPrefix.length);
			break; 
			default:
				if(this.col == this.stdinVal.length) {
					this.col += inputStdin.length;
					this.stdinVal += inputStdin;
					this.ClearLine();
					this.WriteCommand(this.stdinVal.replace("\r", "").replace("\n", ""));
				} else {
					this.stdinVal = insert(this.stdinVal, this.col, inputStdin);
					this.col += inputStdin.length;
					this.ClearLine();
					this.WriteCommand(this.stdinVal.replace("\r", "").replace("\n", ""));
					process.stdout.cursorTo(this.col + this.defaultCommandPrefix.length);
				}
			break;
		}
		return 0
	}
	OnData(inputStdin) {
		return this.commandRender(inputStdin);
	}
}