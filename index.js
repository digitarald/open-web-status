/** @jsx React.DOM */
var React = require('react');
var fuzzy = require('fuzzy');
require('./index.styl');


var Dashboard = React.createClass({
	getInitialState() {
		return {
			features: [],
			query: ''
		};
	},

	componentDidMount() {
		this.load();
	},

	load() {
		var url = 'https://api.github.com/repos/InternetExplorer/Status.IE/contents/app/static/features.json';
		var xhr = new XMLHttpRequest();
		xhr.open('get', url, true);
		xhr.setRequestHeader('Accept', 'application/vnd.github.v3.raw+json');
		xhr.onload = this.onXhrLoad;
		xhr.send();
	},

	onXhrLoad(evt) {
		var xhr = evt.target;
		this.setState({
			features: JSON.parse(xhr.responseText)
		})
	},

	onSearch() {
		var query = this.refs.search.getDOMNode().value;
		this.setState({
			query: query
		})
	},

	render() {
		var view = null;

		if (!this.state.features.length) {
			view = (
				<div>Loading …</div>
			);
		} else {
			view = (
				<FeatureList
					features={this.state.features}
					query={this.state.query}
				/>
			);
		}
		return (
			<main>
				<header>
					<div className='inner'>
						<input
							type='search'
							ref='search'
							placeholder='Search Features'
							onChange={this.onSearch} />
					</div>
				</header>
				<article>
					<div className='inner'>
						{view}
					</div>
				</article>
			</main>
		);
	}
});

var FeatureList = React.createClass({
	render() {
		var data = this.props.features.slice();
		if (!data.length) {
			return (
				<main>Loading</main>
			);
		}

		var query = this.props.query.trim();
		if (query) {
			data = fuzzy.filter(query, data, {
				extract: entry => entry.name + ' ' + entry.summary
			}).map(result => result.original);
		} else {
			var sortIndex = 'name';
			data.sort((a, b) => {
				if (a[sortIndex] < b[sortIndex]) {
					return -1;
				}
				if (a[sortIndex] > b[sortIndex]) {
					return 1;
				}
				return 0;
			});
		}

		var features = data.map((entry) => {
			return <Feature key={entry.name} entry={entry} />
		});
		return (
			<ul>{features}</ul>
		)
	}
});

var Feature = React.createClass({
	render() {
		var entry = this.props.entry;
		return (
			<li title={entry.summary}>
				<h3>
					<a href={entry.spec_link} target='_blank'>{entry.name}</a>
				</h3>
				<div className='status'>
					<a href={entry.ff_views_link} target='_blank'>{entry.ff_views.text}</a>
				</div>
			</li>
		);
	}
});

React.render(<Dashboard />, document.body);
