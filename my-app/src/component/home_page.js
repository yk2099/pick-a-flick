import React from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import styled from "styled-components";


const Button = styled.button`
  background-color: blue;
  color: white;
  padding: 5px 15px;
  border-radius: 5px;
  outline: 0;
  text-transform: uppercase;
  margin: 10px 0px;
  transition: ease background-color 250ms;
`;
 function Home({userDetails}){
    console.log("userDetails ->", userDetails)
    return (
        <div style={{
        backgroundColor: 'firebrick',
        paddingTop: '300px',
        width: '1900px',
        height: '865px',
        textAlign:"inherit"
      }}>
            <h1> <Button>{userDetails ? "Welcome Back! " + userDetails.userName : "Welcome!\n Please sign in for customized experience!"}</Button></h1>
        </div>
    
    
    );
}

export default Home;
