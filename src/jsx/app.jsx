import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery'
// require('../scss/style.scss');

class Soundclouder extends React.Component{
	constructor(props){
		super(props)
		this.state = {data: []};

		SC.initialize({
			client_id: process.env.SOUNDCLOUD_ID
		});
	}

	search(keyword){
		SC.get('/tracks', { q: keyword, limit: '24' }).then((tracks) => {
			var data = this.state.data;
			tracks.forEach((track) => {
				data.push({track: track});
				this.setState({data: tracks});
			}) 
		})
	}

	render(){
		return <SearchForm searchWord={this.search.bind(this)}/>
	}
}

class SearchForm extends React.Component{

	onFormSubmit(e){
		e.preventDefault()
		this.props.searchWord(this.refs.search.value)
		this.refs.search.value = '';

	}

	render(){
		return <div>
			<form onSubmit={this.onFormSubmit.bind(this)}>
				<input type="text" ref="search" />
				<button>Search</button>
			</form>
		</div>
	}	
}

ReactDOM.render(<Soundclouder/>, document.getElementById('content'))