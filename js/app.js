////////////////////////////////////////////////////////////////////////////////////////////////////
//Replacing Redux with Context?

	//Redux
		//Distributes data to various components
		//Centralizes data in a store
		//Provides mechanism for changing data in the store

	//Context
		//Distributes data to various components

	//We're going to do a little refactor to translate 
		//Extracting the language logic out to a serate component:
			//Language Selector:

	//src/components/LanguageSelector.js:
		import React from 'react';
		class LanguageSelector extends React.Component {
			render(){
				return (
					<div>
						Select a language:
						<i className="flag us" onClick={() => this.props.onLanguageChange('english')} />
						<i className="flag nl" onClick={() => this.props.onLanguageChange('dutch')} />
					</div>
				);
			}
		}
		export default LanguageSelector;

	//now render that comp and pass it onLanguageChange prop w/ onLanguageChange method, App.js:
		<LanguageSelector onLanguageChange={this.onLanguageChange}/>

	//Now LanguageSelector can call this.props.onLanguagechange()
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Creating a Store Component

	//IF WE WEANT OT USE CONTEXT IN PLACE OF REDUX...
		//We need to be able to get data to any component in our hierarchy
		//We need to be able to separate our view logic from business logic
		//We need to be able to split up business logic 
			//(not have a single file w/ 1000 lines of code)

	//App
		//LanguageStore Component:
			//LanguageContext.Provider value={language + onLanguageChange}
				//--> Language, onLanguage Change
					//--> UserCreate			//-->LanguageSelector
						//-->Field
						//--> Button
////////////////////////////////////////////////////////////////////////////////////////////////////





////////////////////////////////////////////////////////////////////////////////////////////////////
//Implementing a Language Store

	//LanguageContext.js:
		import React from 'react';
		const Context = React.createContext('english');
		export class LanguageStore extends React.Component {
			state = { language: 'english' };
			onLanguageChange = (language) => {
				this.setState({ language });
			};
			render(){
				return (
					<Context.Provider value={{ ...this.state, onLanguageChange: this.onLanguageChange }}>
						{this.props.children}
					</Context.Provider>
				);

			}
		};
		export default Context;
	//render, set up language context provider
		//Provider: how we'll share current data along w/ ability to change it w/ other components
		//{this.props.children} makes sure we can render some components inside of our language store
			//all comps inside of it will have access to our context object

		//Capital 'C' on Context: react dictates that we must name components w/ starting with capital letters
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Rendering the Language Store

	//import into </App> and render LanguageSTore
		//Langauge store render: we aren't acutally rendering anything
			//just implementing context object an dmaking current state and ability to change it avail
			//to other components inside our hierarchy
	
	//LanguageContext.js:
		import React from 'react';
		const Context = React.createContext('english');
		//import into </App> 
		export class LanguageStore extends React.Component {
			state = { language: 'english' };
			onLanguageChange = (language) => {
				this.setState({ language });
			};
			render(){
				return (
					<Context.Provider value={{ ...this.state, onLanguageChange: this.onLanguageChange }}>
						{this.props.children}
					</Context.Provider>
				);
			}
		};
		export default Context;

	//App.js:
		class App extends React.Component {
			render(){
			//render LanguageStore (wrap contents in LanguageStore so they can have 'business' logic)
				return (
					<div className="ui container">
						<LanguageStore>
							<LanguageSelector/>
							<ColorContext.Provider value={this.state.language === 'english' ? 'primary' : 'orange' }>	
								<UserCreate/>
							</ColorContext.Provider>
						</LanguageStore>
					</div>
				);
			}
		}	
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Connecting the Selector to the Store

	//Field.js: need to make sure it can reach into the context and pull out the language:
		const text = this.context.language === 'english' ? 'Name' : 'Naam'
			//this data is not avaialbe @ this.context.language

	//LanguageSelector.js:
		import LanguageContext from '../context/LanguageContext';
		class LanguageSelector extends React.Component {
			static contextType = LanguageContext;
			render(){
				return (
					<div>
						Select a language:
						<i className="flag us" onClick={() => this.context.onLanguageChange('english')} />
						<i className="flag nl" onClick={() => this.context.onLanguageChange('dutch')} />
					</div>
					//wireup callback that will allow us to change currently selected language:
					//this is no longer available via props, b/c our data is contained in LanguageContext
				);
			}
		};//now this CB can appropriately change the field text, cb is on the CONTEXT {} now
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Connecting Field and Button to the Store

	//Field.js:
		const text = this.context.language === 'english' ? 'Name' : 'Naam';
			//language is now contained on the context object, field correctly changes name now

	//Button.js:
		import React from 'react';
		import LanguageContext from '../context/LanguageContext';
		import ColorContext from '../context/ColorContext';
		class Button extends React.Component {
			renderSubmit = (language) => {
				return language = 'english' ? 'Submit' : 'Voorleggen';
			}
			renderButton = (color) => {
				return (
					<button className={`ui button ${color}`}>
						<LanguageContext.Consumer>
							{({ language }) =>this.renderSubmit(language)}
						</LanguageContext.Consumer>
					</button>
				);
			}
			render(){
				return (
					<ColorContext.Consumer>
						{(color) => this.renderButton(color)}
					</ColorContext.Consumer>
				);
			}
		}
		export default Button;
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Context vs Redux Recap

	//THIS IS WHY YOU SHOULD ALWAYS CONSIDER USING REDUX IN ANY SERIOUS APPLICATION

	//REDUX
		//Excellent Documentation
		//Well-known design patterns
		//Tremendous amount of open source libs

	//CONTEXT
		//No need for an extra lib
		//Hard to build a 'store' component with cross cutting concerns



