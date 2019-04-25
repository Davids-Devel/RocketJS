//Const
import { 
	VueCompiler,
	ReactCompiler,
	AngularCompiler
} from "Core";
import FF from "FileFunctions";
import clc from "cli-color";
import {version} from "../../package.json";

const functions = new FF();

/**
 * CLI
 * 
 * Initialize and Handle the Command Line Interface (CLI)
 * 
 * @class
 */
class CLI {
	/**
	 * CLI
	 * 
	 * @constructor
	 * @param {Object} param0 
	 */
	constructor({entry, output, mode}) {
		this.entry = entry;
		this.output = output;
		this.mode = mode;

		if (this.entry === "not-file") {
			console.log(clc.redBright("\nError!!!\n"));
			console.log(clc.whiteBright("Please select a file to compile."));
			return;
		}

		functions.setParams(entry, output);
		this.handleMode();
	}
	/**
	 * Handle Mode
	 * 
	 * Get compiler mode and then call respective compiler.
	 * If not have valid compiler throw Invalid Mode Error
	 * 
	 * @public
	 */
	handleMode() {
		switch(this.mode) {
		case "vue":
			this.compile("vue");
			break;
		case "react":
			this.compile("react");
			break;
		case "angular":
			this.compile("angular");
			break;
		default:
			this.invalidMode();
			break;
		}
	}
	/**
	 * Compile
	 * 
	 * Execute a Compiler corresponding with mode
	 * 
	 * @param {String} mode 
	 */
	compile(mode) {
		
		let {html, css, js, name} = this.fileContent;

		functions.filterJavascriptDataFile(js);

		let compiler;
		switch(mode) {
		case "vue":
			compiler = VueCompiler;
			break;
		case "react":
			compiler = ReactCompiler;
			break;
		case "angular":
			compiler = AngularCompiler;
			break;
		default: break;
		}
		const {main, components} = compiler(name, html, css);
		functions.writeFile({
			name,
			content:main,
			type:mode
		});
		functions.writeComponents(name, mode, components);
		this.sayThanks();
	}
	/**
	 * Show Help
	 * 
	 * Show help Window
	 * 
	 * @static
	 * @public
	 */
	static showHelp() {
		//Help Commands
		console.log(`\nUsage:	rocket <command> [filename] <output-folder>
	rocket [option]

Commands:
  ${clc.whiteBright("react")}			Translate to React
  ${clc.whiteBright("vue")}			Translate to Vue
  ${clc.whiteBright("angular")}		Translate to Angular

Options:
  ${clc.whiteBright("--help, -h")}		Show help
  ${clc.whiteBright("--version, -v")}		Show version number`);
	}
	/**
	 * Show Version
	 * 
	 * @static
	 * @public
	 */
	static showVersion() {
		console.log(`v${version}`);
	}
	/**
	 * Invalid Mode
	 * 
	 * Show a Message with the invalid Mode
	 * 
	 * @static
	 * @public
	 *
	 * @param {String} mode 
	 */
	static invalidMode(mode) {
		console.log(clc.redBright("\nError!!!\n"));
		console.log(clc.redBright(`Invalid Mode ${clc.whiteBright(`"${mode}"`)}`));
	}
	/**
	 * File Content Getter
	 * 
	 * @return {Object}
	 */
	get fileContent() {
		let componentName = this.entry.match(/((\w*-)*\w*|\w*)(?=.html$)/); //Get the name from the file

		let name = componentName[0].split("-").map(e => {
			return e[0].toUpperCase() + e.slice(1);
		}).join(""); //convert to CamelCase
		
		let html = functions.getFile(); //Get the html file data
		let js = functions.getJs(); //Get the JS file data
		let css = functions.getCSS(); //Get the CSS file data

		return {
			html,
			css,
			js,
			name
		};
	}
	/**
	 * Say Thanks
	 * 
	 * Show a Thanks Message to invite to follow on my Social Networks
	 * 
	 * @public
	 */
	sayThanks() {
		console.log(clc.greenBright("\nSuccess...\n"));
		console.log(`Thanks for use ${clc.whiteBright("Rocket Translator")}.\n\nOpen ${clc.whiteBright(this.output)} to view your files.`);
		console.log(`\nSend a feedback to ${clc.whiteBright("@David_Devel")} on Twitter.\n\nTo report a Error, open a new issue on:\n${clc.whiteBright("https://github.com/Davids-Devel/rocket-translator")}`);
	}
}

export default CLI;