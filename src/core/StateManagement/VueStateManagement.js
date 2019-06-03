import StateManagement from "./StateManagement";
import Events from "Const/Events";

/**
 * Vue State Management
 *
 * Class to handle the Vue Data
 *
 * @class
 * @extends StateManagement
 *
 */
class VueStateManagement extends StateManagement {

	/**
	 * Component Data
	 * 
	 * Return the filtered component data
	 *
	 * @public
	 * @param {String} componentName
	 * @param {String} html
	 *
	 * @return {String}
	 */
	componentData(componentName, html){
		return this._mapComponentData(componentName, html);
	}

	/**
	 * Filter HTML
	 *
	 * Filter and return the html with the Vue Syntax
	 *
	 * @public
	 * @param {String} html
	 * @return {String}
	 *
	 */
	filterHTML(html){
		//Quotes Replace to double quotes
		let replacedQuotes = html.replace(/(')/g, "\"");

		//Parse open braces
		let addOpenBraces = replacedQuotes
			.split(/\{(?=\w*)/g)
			.map(content => {
				if (content) return content.replace(/(\s*-.*\}|\})/g, "}}");
			})
			.join("{{");
		
		//Parsing Event Tags "on"
		let addEventToVue = addOpenBraces
			.replace(new RegExp(`on(?=('|")${Events.join("|")})`), "@");

		/*----------Parsing Inputs Tags----------*/
		
		/*
		* If have the attr "name" this is replace whit the v-model directive
		*/

		let inputTag = addEventToVue
			.split(/<input/g)
			.map((content, i) => {
				if (i > 0) {
					let nameTag = content.match(/name=("|')\w*("|')/);
					var vModelDirective = "";

					if (nameTag && !global.RocketTranslator.ignoreInputName)
						vModelDirective = `v-model='${nameTag[0].match(/"\w*(?=")/)[0].slice(1)}'`;
					
					return content.replace(" ", ` ${vModelDirective}`);
				} 
				return content;
			})
			.join("<input");

		let textareaTag = inputTag
			.split(/<textarea/g)
			.map((content, i) => {
				if (i > 0) {
					let nameTag = content.match(/name=("|')\w*("|')/);
					var vModelDirective = "";
					
					if (nameTag && !global.RocketTranslator.ignoreInputName)
						vModelDirective = `v-model='${nameTag[0].match(/"\w*(?=")/)[0].slice(1)}'`;
					
					return content.replace(" ", ` ${vModelDirective}`);
				} 
				return content;
			})
			.join("<textarea");

		let selectTag = textareaTag
			.split(/<select/g)
			.map((content, i) => {
				if (i > 0) {
					let nameTag = content.match(/name=("|')\w*("|')/);
					var vModelDirective = "";
					
					if (nameTag && !global.RocketTranslator.ignoreInputName)
						vModelDirective = `v-model='${nameTag[0].match(/"\w*(?=")/)[0].slice(1)}'`;
					
					return content.replace(" ", ` ${vModelDirective}`);
				} 
				return content;
			})
			.join("<select");

		const condParsed = selectTag
			.split(/<(?=if.*>|else.*>)/)
			.map((cond, i) => {
				if (i > 0) {
					const condTagName = cond.match(/^\w*(-\w*)*/)[0];
					const tagRegExp = /\s*tag="\w*(-\w*)*"/;
					var tagName = "template";

					if (tagRegExp.test(cond)) 
						tagName = cond.match(tagRegExp)[0]
							.replace(/\s*tag=/, "")
							.replace(/'|"/g, "");

					return cond.replace(new RegExp(`${condTagName} cond="(?=.*>)`, "g"), `${tagName} v-${condTagName}="`)
						.replace(`</${condTagName}>`, `</${tagName}>`)
						.replace(`${condTagName}>`, `${tagName} v-${condTagName}>`)
						.replace(tagRegExp, "")
						.replace(/"\s*"/, "\"'");
				}
				return cond;
			})
			.join("<");

		//Parsing the bind attr with the v-bind directive
		let bindDirectivesReplaced = condParsed
			.split(/:(?=\w*=)/)
			.map((content, i) => {
				if (i > 0) {
					const bindSimpleOrWithTypeRegExp = /^\w*="(\w*(\s*-\s*\w*)*)"/;
					const bindWithConditional = /^\w*="\s*\w*\s*(\?).*('|"|}|])\s*"/;

					if (bindSimpleOrWithTypeRegExp.test(content)) {
						const bindAttr = content.match(bindSimpleOrWithTypeRegExp)[0];

						if (/prop/.test(bindAttr) || /state/.test(bindAttr))
							return content.replace(bindAttr, bindAttr.replace(/\s*-.*$/, "\""));
						
						return content;
					}
					else if (bindWithConditional.test(content)) {
						const expression = content.match(bindWithConditional)[0];
						const replacedQuotes = expression
							.replace(/"/g, "'")
							.replace("'", "\"")
							.replace(/'$/, "\"");
						
						return content.replace(expression, replacedQuotes);
					}
				}

				//return content of index 0
				return content;
			})
			.join(":");
			
		//Parsing for tags
		let loopParse = bindDirectivesReplaced
			.split(/<(?=for val=)/)
			.map((e, i) => {
				if (i > 0) {
					const tagRegExp = /\s*tag=('|")\w*(-\w*)*('|")/;
					var tagName = "template";
					if (tagRegExp.test(e)) 
						tagName = e.match(tagRegExp)[0]
							.replace(/\s*tag=/, "")
							.replace(/'|"/g, "");

					return e.replace(/for val=(?=.*>)/g, `${tagName} v-for=`)
						.replace(/\/for(?=>)/g, `/${tagName}`)
						.replace(tagRegExp, "");
				}
				return e;
			})
			.join("<");
			
			
		let componentParsed = loopParse
			.split("<component ")
			.map((content, i) => {
				if (i > 0) {
					let componentName = content.match(/name=('|")\w*/)[0].slice(6);
					let splitted = content.split("</component>");
					let componentTag = splitted[0].split(/\r\n|\n|\r/)[0];

					return componentTag
						/*Deleted component name attr*/
						.replace(/component-name=('|")\w*('|")/, componentName)

						/*If not have add enclosing tag*/
						.replace(">", "/>") + splitted[1];
				} 
				return content;
			})
			.join("<");

		return componentParsed;
	}

	/**
	 * Map Component Data
	 *
	 * @private
	 * @param {String} componentName
	 * @param {String} html
	 *
	 * @return {String}
	 */
	_mapComponentData(componentName, html){
		const haveComponents = this.components.length > 0;
		const haveProps = this.props.length > 0;
		const haveStates = this.states.length > 0;
		const haveLifecycles = this.lifecycle.length > 0;
		const haveComputed = this.computed.length > 0;
		const haveMethods = this.methods.length > 0;
		const haveWatchers = this.watchers.length > 0;
		const haveJSX = global.RocketTranslator.jsx;

		//Strings to data content
		let importComponents = "";
		let components = "";
		let props = "";
		let states = "";
		let lifecycle = "";
		let computed = "";
		let methods = "";
		let watchers = "";
		let jsx = "";

		//Components
		if (haveComponents) {
			const comma = 
				haveProps ||
				haveStates ||
				haveLifecycles ||
				haveComputed ||
				haveMethods ||
				haveWatchers ||
				haveJSX ? "," : "";
				
			components = `\n\tcomponents:{\n\t\t${this.components.join(",\n\t\t")}\n\t}${comma}`;

			importComponents = this.components.map(e => `import ${e} from "~/components/${e}"\n`).join("");
		}

		//Props
		if (haveProps) {
			const comma = 
				haveStates ||
				haveLifecycles ||
				haveComputed ||
				haveMethods ||
				haveWatchers ||
				haveJSX ? "," : "";

			let lastIndex = this.props.length - 1;
			let mappedProps = this.props.map((e, i) => {

				let comma = i === lastIndex ? "" : ",";
				return `\n\t\t${e}:{\n\t\t\ttype:String,\n\t\t\trequired:true,\n\t\t\tdefault:"Hola Mundo"\n\t\t}${comma}`;
			});
			props = `\n\tprops:{${mappedProps.join("")}\n\t}${comma}`;
		}
		//Map States
		if (haveStates) {
			const comma = 
				haveLifecycles ||
				haveComputed ||
				haveMethods ||
				haveWatchers ||
				haveJSX ? "," : "";

			var mappedStates = {};

			this.states.forEach(state => {
				let isObject = typeof state === "object";
				let stateName = isObject ? state.key : state.replace(/("|')/g, "");

				mappedStates[stateName] = isObject ? state.value : "";
			});
			states = `\n\tdata(){\n\t\treturn ${this._JSONPrettify(mappedStates)}\n\t}${comma}`;
		}

		//Lifecycles
		if(haveLifecycles) {
			const comma = 
				haveComputed ||
				haveMethods ||
				haveWatchers ||
				haveJSX ? "," : "";

			const mappedLifecycles = this.lifecycle.map(({name, content}) => {
				content = content
					.split(/\n|\r\n|\r/)
					.map(e => e.replace("\t", ""))
					.join("\r\n");

				return `${name}${content}`;
			});

			lifecycle = `\n\t${mappedLifecycles.join(",\n\t")}${comma}`;
		}

		//Computed Properties
		if (haveComputed) {
			const comma = 
				haveMethods ||
				haveWatchers ||
				haveJSX ? "," : "";

			let mappedComputed = this.computed.map(({name, content}) => `${name}${content}`);

			computed = `\n\tcomputed:{\n\t\t${mappedComputed.join(",\n\t\t")}\n\t}${comma}`;
		}

		//Methods
		if (haveMethods){
			const comma =
				haveWatchers ||
				haveJSX ? "," : "";

			let mappedMethods = this.methods.map(({content, name}) => `${name}${content}`);

			methods = `\n\tmethods:{\n\t\t${mappedMethods.join(",\n\t\t")}\n\t}${comma}`;
		}

		//Watchers
		if (haveWatchers) {
			const comma =
				haveJSX ? "," : "";

			let mappedWatchers = this._filterJS(this.watchers, "v").map(({content, name}) => `${name}${content}`);

			watchers = `\n\twatch:{\n\t\t${mappedWatchers.join(",\n\t\t")}\n\t}${comma}`;
		}

		//JSX
		if (haveJSX) {
			const {html: HTML, loops, conditionals} = this._generateJSX(html);

			var preRender = loops.concat(conditionals).join("\n");
			
			jsx = `\n\trender() {${preRender} return (${HTML})}`;
		}
		const haveData = 
			haveComponents ||
			haveProps ||
			haveStates ||
			haveLifecycles ||
			haveComputed ||
			haveMethods ||
			haveWatchers ||
			haveJSX;

		let mainTemplate = 	`${importComponents}export default {\n\tname:"${componentName || "MyComponent"}"${haveData ? "," : ""}${components}${props}${states}${lifecycle}${computed}${methods}${watchers}${jsx}\n}`;
		
		if (haveData)
			return `<script>\n${mainTemplate}\n</script>`;
		
		return "";
	}
}

export default VueStateManagement;
