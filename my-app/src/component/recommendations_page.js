import React from 'react';
import './recommendations_page.css'
import PopularMoviesList from '../popular_movies_list'


 function Recommendations(){
    return (
        <div style={{
            backgroundColor: 'firebrick',
            textAlign:"inherit"
          }}>
            <h1>Your Movie Recommendations</h1>
            <PopularMoviesList/>
        </div>
    );
}

export default Recommendations;