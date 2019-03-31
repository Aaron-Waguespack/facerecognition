import React from 'react';
import Tilt from 'react-tilt';
import './Logo.css';
import brain from './brain.png'
const Logo =() => {
	return (
		<div className='ma5 mt0'>
			<Tilt className="Tilt br2 shadow-5" options={{ max : 80 }} style={{ height: 200, width: 200 }} >
 				<div className="Tilt-inner"> <img className='logo-img' style={{paddingTop: '20px'}} alt="logo" src={brain}/> </div>
			</Tilt>
		</div>
	);
}

export default Logo;