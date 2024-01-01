import React, {Component} from "react"
import {ListGroup, ListGroupItem} from "react-bootstrap"
import themoviedb from  './moviedb.js'

// updating the api_key in the moviedb
themoviedb.common.api_key = "26a91d7ed31857a2aaea9cc746a31703"

export default class PopularMoviesList extends Component {
	state = {
		movies: [],
		movie: {},
		show: false
	}

	getMovies = () => {
		var self = this

		themoviedb.movies.getPopular({},
	 	function (movies) {
	 		movies = JSON.parse(movies)
	 		if (movies.results && movies.results.length > 0) {
	 			self.setState({
	 				movies: movies.results
	 			})

	 			self.props.onMovies(null, movies)
	 		}
		}, 
		function (error) {
			// do something with errorCallback
			console.error(error)
			self.props.onMovies(error)
		})
	}

	componentDidMount = () => {
		this.getMovies()
	}

	onClick = (movie) => {
		console.log(movie)
		console.log('clicked')
		this.setState({
			movie: movie,
			show: true
		})
	}

	onHide = () => {
		this.setState({
			show: false
		})
	}


	render = () => {
		var term = this.props.searchTerm
		var filteredMovies = []

		if (this.state.movies.length > 0) {
			if (typeof term == "string" && term && term.trim()) {
				filteredMovies = this.state.movies.filter((value) => {
					return value.title.toLowerCase().match(term) != null
				})
			}
			else {
				filteredMovies = this.state.movies
			}

			var movies = filteredMovies.map((value, index, array) => {
				return (
						<ListGroupItem onClick={this.onClick.bind(this, value)} key={value.id} href={"#/movies/" + value.id}>{value.title}</ListGroupItem>	
					)
			})


			return (
					<div style={{
						backgroundColor: 'firebrick',
						width: '1900px',
						height: '865px',
						textAlign:"inherit"
					  }} className="PopularMovies">
						<ListGroup>
							{movies}
						</ListGroup>
					</div>
				)

		}
		else {
			return false
		}
	}
}