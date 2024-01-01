import React from "react"
import theMovieDb from  './moviedb.js'
import { useEffect} from "react";
import './get_movie_details.css';

export default function MovieDetails(props){
    useEffect(() => GetMovieDetails(props.id), [props.id]);

    function GetMovieDetails(id) {

        theMovieDb.movies.getById({
            "id" : id  
        }, function( data ) {
            data = JSON.parse( data );
            props.setMovieInformation({
                details: data,
                url: "https://image.tmdb.org/t/p/original/" + data.poster_path,
                year: data.release_date.substring(0,4),
                genres: data.genres[0].name + "/" + data.genres[1].name,
                overview: data.overview,
                voteAverage: data.vote_average,
                popularity: data.popularity
            })
        }, function( err ) {
            console.error(err)
        });
    }

    //poster url example:  https://image.tmdb.org/t/p/original//3zXceNTtyj5FLjwQXuPvLYK5YYL.jpg
    return (
      <div className='movie-card-container'>
          {props.movieInformation && 
            <div >
              <img className = 'movie-poster' src = {props.movieInformation.url} alt={"new"}/>
              <h1>{props.movieInformation.details.title}</h1>
              <h2>{props.movieInformation.year}  {props.movieInformation.genres}</h2>
              <h4 className = 'overview'>{props.movieInformation.overview}</h4>
            </div>}
      </div>      
    );
}