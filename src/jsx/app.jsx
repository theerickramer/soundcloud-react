import React from 'react';
import ReactDOM from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import $ from 'jquery'
require('../scss/style.scss');

class Soundclouder extends React.Component{
	constructor(props){
		super(props)
		this.state = {data: []};

		SC.initialize({
			client_id: process.env.SOUNDCLOUD_ID
		});

		this.audioContext = new AudioContext()
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
		return (
			<div>
				<h1>Soundclouder</h1>
				<SearchForm searchWord={this.search.bind(this)}/>
				<SearchResultsList ctx={this.audioContext} data={this.state.data}/>
			</div>
		)
	}
}

class SearchForm extends React.Component{
	onFormSubmit(e){
		e.preventDefault()
		this.props.searchWord(this.refs.search.value)
		this.refs.search.value = '';

	}

	render(){
		return (
			<div>
				<form onSubmit={this.onFormSubmit.bind(this)}>
					<input type="text" ref="search" />
					<button>Search</button>
				</form>
			</div>
		)
	}	
}

class SearchResultsList extends React.Component{
	render(){
		return (
			<ul>
			{this.props.data.map((result)=> {
				return <SearchResult 
					ctx={this.props.ctx}
					artwork={result.artwork_url ? result.artwork_url : result.user.avatar_url} 
					title={result.title} 
					stream={result.stream_url}
					key={result.id}/>
			})}
			</ul>
		)
	}
}

class SearchResult extends React.Component{
	constructor(props){
		super(props);
		this.audioContext = this.props.ctx;
	}

	play(){
		this.player = this.audioContext.createBufferSource();
		this.player.connect(this.audioContext.destination);
		if (!this._loaded) {
			this.getAudio();
		} else {
			this.player.buffer = this.buffer;
			this.startTime = this.audioContext.currentTime;
		}
		this.player.start(0, this.startOffset)
	}

	getAudio(){
	  var request = new XMLHttpRequest()
	  request.open('GET', `${this.refs.stream.dataset.streamUrl}?client_id=${process.env.SOUNDCLOUD_ID}`)
	  request.responseType = 'arraybuffer'
	  request.onload = () => {
	    this.audioContext.decodeAudioData(request.response, (audio) => {
				this.startTime = 0;
				this.startOffset = 0;
	    	this.buffer = audio;
				this.player.buffer = this.buffer;
	    	this._loaded = true;
	    })
	  }
	  request.send()
	}

	stop(){
		this.player.stop();
	}

	pause(){
		this.player.stop();
		this.startOffset += this.audioContext.currentTime - this.startTime;
	}


	render(){
		return (
			<li ref="stream" data-stream-url={this.props.stream}>
				<img src={this.props.artwork}/>
				<h5>{this.props.title}</h5>
				<button onClick={this.play.bind(this)}>play</button>
				<button onClick={this.pause.bind(this)}>pause</button>
				<button onClick={this.stop.bind(this)}>stop</button>
			</li>
		)
	}
}

ReactDOM.render(<Soundclouder/>, document.getElementById('content'))