import React, { Component } from 'react';
import Particles from 'react-particles-js';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Navigation from './Components/Navigation/Navigation';
import Rank from './Components/Rank/Rank';
import SignIn from './Components/SignIn/SignIn';
import Register from './Components/Register/Register';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import './App.css';


const particlesOptions= {
  particles: {
    number :{
      value:70,
      density: {
        enable:true,
        value_area:800
      }
    },
    line_linked: {
      opacity: 1
    }
  }
}

const initialState ={
    input:'',
    imageUrl:'',
    box:[],
    route:'signInRoute',
    isSignedIn: false,
    user: {
      id: '',
      name: '',
      email: '',
      entries: 0,
      joined: ''
    }
  }


class App extends Component {
  constructor() {
    super();
    this.state =initialState;
  }
  
  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    const clarifaiRegions= data.outputs[0].data.regions.map(region=> region);
    let clarifaiFace=[]
    let boxes = []
    const image = document.getElementById("inputimage")
    const width = Number(image.width);
    const height = Number(image.height);
      for(let i=0;i<clarifaiRegions.length; i++){
        Object.assign(clarifaiFace, clarifaiRegions[i].region_info.bounding_box);
        boxes.push({
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row*height,
        rightCol: width-(clarifaiFace.right_col*width),
        bottomRow: height - (clarifaiFace.bottom_row*height)
      });
    }
    return boxes;
   } 

  displayFaceBox =(box) => {
    this.setState({box: box});
  }

  onInputChange = (event) =>{
    this.setState({input:event.target.value});
  } 

  onPictureSubmit = () => {
    this.setState({imageUrl: this.state.input});
      fetch('https://facerecognition-api-aw.herokuapp.com/imageurl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
        input: this.state.input
        })
      }) 
      .then(response => response.json())
      .then(response => {
        if(response) {
          fetch('https://facerecognition-api-aw.herokuapp.com/image', {
              method: 'put',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
              id: this.state.user.id
              })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count}))
          })
          .catch(console.log)
        }
       this.displayFaceBox(this.calculateFaceLocation(response))
    })
      .catch(err=>console.log(err));
  }

  onRouteChange = (route) => {
    if( route === 'signOutRoute') {
      this.setState(initialState)
    }else if(route ==='homeRoute'){
      this.setState({isSignedIn:true})
    }
    this.setState({route:route})
  }

  render() {
   const {isSignedIn, imageUrl, route, box} = this.state;
    return (
      <div className="App">
        <Particles className="particles"
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {route === 'homeRoute'
        ?<div>
          <Logo/>
          <Rank name={this.state.user.name} 
                entries={this.state.user.entries}/>
          <ImageLinkForm 
            onInputChange={this.onInputChange} 
            onPictureSubmit={this.onPictureSubmit}
          />
          <FaceRecognition box={box} imageUrl={imageUrl}/>
        </div>
       : (
        route === 'signInRoute'
        ?<SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        :<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
       )
        
     }
      </div>
    );
  }
}

export default App;

