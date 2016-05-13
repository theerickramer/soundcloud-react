import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery'
require('../scss/style.scss');

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
		return <div>
				<h1>Soundclouder</h1>
				<SearchForm searchWord={this.search.bind(this)}/>
				<SearchResultsList data={this.state.data}/>
			</div>
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

class SearchResult extends React.Component{
	render(){
		return <li><img src={this.props.artwork}/><h5>{this.props.title}</h5></li>
	}
}

class SearchResultsList extends React.Component{
	render(){
		return <ul>
		{this.props.data.map((result)=> {
			return <SearchResult artwork={result.artwork_url ? result.artwork_url : result.user.avatar_url} title={result.title} key={result.id}/>
		})}
		</ul>
	}
}

ReactDOM.render(<Soundclouder/>, document.getElementById('content'))