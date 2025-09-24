const CMDPermissions = require('./SRC/CMDPermissions')
const EventEmitter = require('node:events');
const BScriptRunner = require('bscriptrunner').BScriptRunner;
const BSType = require('bscriptrunner').Type;
const { readDirRecursive, delay } = require('./SRC/utils/utils');
const TCC = require('./TerminalCommandController');
const fs = require('fs');
const path = require('path');

var runInNewContext = require('vm').runInNewContext;

module.exports = class CMD extends EventEmitter{
	constructor(options={}) {
		super();
		// Terminal Command Controller
		this.started = options.started??true;

		this._commands = { };
		this._commandHistoryLimit = 10;
		this.commandHistory = [];
		this._historyPos = -1;
		this.returnCode = 1;

		this._perUpdateInterval = null;
		this.perrmissionsKeys={...CMDPermissions, ...options.perrmissionsKeys??{}};

		this.commandsPaths=[__dirname + '/commands', ...options.commandsPaths??[]]
		this.cmdRootPermissions = [...options.cmdRootPermissions??[]];
		this.cmdPermissionsHistory = [[CMDPermissions.default, ...options.historyFirstPermissions??[]], ...options.cmdPermissionsHistory??[]];
		this.commandController = new TCC();
			this.commandController.defaultCommandPrefix = " <help>? ";
			this.commandController.col = 0;
			this.commandController.stdinVal = "";
			this.commandController.stdinEmmiter = process.stdin;
			this.commandController.CMD = this;
	}
	loader = async (func) => {
		this.returnCode = -1
	  let _loaderAnimation = async () => {  
	    var iteractions = 8
	    while(iteractions > 0) {
	      switch(iteractions % 4) {
	        case 4:
	          this.commandController.ClearLine();
	          this.commandController.CursorTo(0);
	          this.commandController.Write("Loading");
	        break;
	        case 3:
	          this.commandController.ClearLine();
	          this.commandController.CursorTo(0);
	          this.commandController.Write("Loading.");
	        break;
	        case 2:
	          this.commandController.ClearLine();
	          this.commandController.CursorTo(0);
	          this.commandController.Write("Loading..");
	        break;
	        case 1:
	          this.commandController.ClearLine();
	          this.commandController.CursorTo(0);
	          this.commandController.Write("Loading...");
	        break;
	      }
	      await delay(200);
	      iteractions--;
	    }
	  }
	  var loaderOn = true;
	  var loaderContinue = false;
	  const startAnimation = async () => {
	      loaderOn = true;
	      loaderContinue = false;
	      while(loaderOn) {
	        await _loaderAnimation();
	      }
	      loaderContinue = true;
	  };
	  startAnimation();
	  const waitForPromise = async (onStop) => {
	    loaderOn = false;
	    return await new Promise(res=> { 
	      const interval = setInterval(()=>{ 
	        if(loaderContinue) {
	          clearInterval(interval);
	          (async () => {
	            res(await onStop());
	            startAnimation();
	          })()
	        } 
	      }, 500)
	    });
	  }
	  const conAnimation = async () => {
	    loaderOn = false;
	    await new Promise(res=>setInterval(()=>{ if(loaderContinue) { res() } }, 500));
	    this.returnCode = 1;
	  }
	  return await new Promise(res => func( () => conAnimation().then(res), waitForPromise, startAnimation ) )
	}
	_updateCommands() {
		this._commands = {};
		const cmdPermission = [...this.cmdPermissionsHistory[this.cmdPermissionsHistory.length-1], ...this.cmdRootPermissions]

		const commandFiles = this.commandsPaths.map(path => 
			readDirRecursive(path)
				.filter((file) => file.endsWith('.js'))
		).flat(1)
		let uniqueKey = 0;
		for (const file of commandFiles) {
			delete require.cache[file];
			var _module = new module.constructor();
			_module.paths = module.paths;
		    var sandbox = {}
			Object.getOwnPropertyNames(global).map((k)=>{
				sandbox[k] = global[k];
			})
			sandbox.require = require
			sandbox.exports = [];
			sandbox.CMDPermissions = this.perrmissionsKeys;
			sandbox.__filename = __filename;
			sandbox.__dirname = __dirname;
			sandbox.__commandDir = path.dirname(file);
			sandbox.__rootDir = require.main.path;
			sandbox.module = _module;
			sandbox.global = {};
			
			var content = fs.readFileSync(file, 'utf8');
			runInNewContext(content, sandbox, { filename: file });

			const command = _module.exports;
			if((command.perms == undefined ? true : cmdPermission.some(currentPerm => command.perms.includes(currentPerm))) && !cmdPermission.some(currentPerm => command.excludePerms ? command.excludePerms.includes(currentPerm) : false))
				if(Array.isArray(command.name)) {
					command.name.map(commandName => this.createCommand({ name: commandName, execute: command.execute, description: command.description, syntax: command.syntax, uniqueKey: uniqueKey}));
				} else {
					this.createCommand({ name: command.name, execute: command.execute, description: command.description, syntax: command.syntax, uniqueKey: uniqueKey});
				}
			uniqueKey += 1;
		}
	}
	pushToCommandHistory(cmd) {
		if(this.commandHistory[this.commandHistory.length - 1] == cmd)
			return;
		this.commandHistory.push(cmd);
		if(this.commandHistory.length > this._commandHistoryLimit) {
			this.commandHistory.shift();
		}
	}
    createCommand({ name, execute, description = "", syntax, uniqueKey }) {
        this._commands[name] = { execute, description, syntax, uniqueKey };
    }
    removeCommand(name) {
    	delete this._commands[name]
    }
    bscript(run, options) {
    	if(!run)
    		return;
    	const bScriptRunner = new BScriptRunner(this, options)
    	bScriptRunner.Create(run)
    	return bScriptRunner.executer;
    }
	async Start() {
		this._updateCommands();
		this.started = true;
		this._perUpdateInterval = setInterval(() => this.emit("perUpdate"), 300);
		while(true) {
			await this.waitForPerUpdate();
			if(this.returnCode == 1){
				const value = await this.Input(this.commandController.defaultCommandPrefix);
				if(value)
				{
					this.pushToCommandHistory(value);
					this.bscript(value)();
				}
			}
		}
		this.on("perUpdate", onPerUpdate);
	}
	Stop() {
		this.started = false;
		process.stdout.clearLine();
  		process.stdout.cursorTo(0);
  		clearInterval(this._perUpdateInterval);
	}
	async waitForPerUpdate() {
		await new Promise(res => this.once('perUpdate', res));
	}
	async Input(prefix = " > ") {
		this.returnCode = -1;
		await this.waitForPerUpdate();
		this.returnCode = 0;
		const nativePrefix = this.commandController.defaultCommandPrefix;
		this.commandController.defaultCommandPrefix = prefix;

		this.commandController.InitInput(true);

		this.commandController.stdinVal = "";
		this.commandController.col = 0;

		this.commandController.CursorTo(0);
		this.commandController.WriteCommand("");

		let onData = async (inputStdin) => {
			this.returnCode = this.commandController.OnData(inputStdin);
		}

		this.commandController.SetStdinListener('data', onData);
		

		return await new Promise(res => {
			let exit = () => {
				this.commandController.defaultCommandPrefix = nativePrefix;
				this.commandController.RemoveStdinListener('data', onData);
				this.removeListener('perUpdate', perUpdate);
				this.commandController.InitInput(false);
			}
			let perUpdate = async () => {
				switch(this.returnCode) {
					case 1:
						exit();
						res(this.commandController.stdinVal);
						break;
					case -1: // breaking
						exit();
						this.commandController.ClearLine();
				  		this.commandController.CursorTo(0);
						res(undefined);
						break;
				}
			}
			this.on('perUpdate', perUpdate)
		})
	}
}