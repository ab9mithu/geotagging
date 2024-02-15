import { useEffect, useState} from "react";
import Map, {Marker,Popup}  from "react-map-gl";
import RoomIcon from '@mui/icons-material/Room';
import "mapbox-gl/dist/mapbox-gl.css";
import "./app.css";
import axios from "axios";
import StarIcon from '@mui/icons-material/Star';
import Register from "./components/register/register";
import Login from "./components/login/login";







function App() {
  const myStorage=window.localStorage;
  const [showRegister,setShowRegister]=useState(false)
  const [showLogin,setShowLogin]=useState(false)
const [newPlace,setNewPlace]=useState(null)
  const [currentUser,setCurrentUser] =useState(myStorage.getItem("user"))
  const [currentPlaceId,setCurrentPlaceId]=useState(null)
  const [title,setTitle]=useState(null)
  const [review,setReview]=useState(null)
  const [rating,setRating]=useState(0)
 const [pins,setPins]=useState([])
  const [viewState, setViewState] = useState({
    longitude: 78,
    latitude: 20,
    zoom: 4.0,
  });


  useEffect(()=>{
    const getPins=async()=>{
      try{
        const res= await axios.get("/pins")
        setPins(res.data)

      }catch(err){
        console.log(err)
      }
    }
    getPins();
  },[])

  const handleMarkerClick=(id,lat,long)=>{
    console.log("i m clicked")
    setCurrentPlaceId(id);
    setViewState({...viewState,latitude:lat,longitude:long})
}
const handleAddClick = (e) => {
  const { lng, lat } = e.lngLat;
  setNewPlace({
    lat: lat,
    long: lng,
  });
};

const handleLogout=()=>{
  myStorage.removeItem("user");
  setCurrentUser(null)
}
const handleSubmit=async(e)=>{
  console.log(currentUser,title,review,rating,newPlace.lat,newPlace.long)
  e.preventDefault()
  const newPin={
    username:currentUser,
    title:title,
    desc:review,
    rating:rating,
    lat:newPlace.lat,
    long:newPlace.long,
    }
  try{
    const res= await axios.post("/pins",newPin)
    console.log(res)
    setPins([...pins,res.data])
    setNewPlace(null)

  }catch(err){
    console.log(err)
  }

}

 
  return (
    <div >
      <Map
        style={{ width: "100vw", height: "100vh" }}
        {...viewState}
        mapboxAccessToken={process.env.REACT_APP_MYID}
        
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onDblClick={handleAddClick}
        
      > 
      {pins.map((p)=>(
        <>
        <Marker longitude={p.long} latitude={p.lat} >
        <RoomIcon onClick={(e) => {e.stopPropagation(); handleMarkerClick(p._id,p.lat,p.long)}}
         style={{ fontSize: "30px", color: p.username===currentUser?"red":"blue", cursor:"pointer"}}/>
        </Marker>

      {p._id===currentPlaceId && (
       <Popup longitude={p.long} latitude={p.lat}
              anchor="bottom" onClose={()=>setCurrentPlaceId(null)}>
      <div className="card">
        <label>place</label>
        <h4 className="place">{p.title}</h4>
        <label>review</label>
        <p className="desc">{p.desc}</p>
        <label>rating</label>
        <div className="stars">
        {Array(p.rating).fill(<StarIcon className="stars"/>)}
        </div>
        <label>information</label>
        <span className="username">created by <b>{p.username}</b></span>
        <span className="date">1 hour ago</span>
        </div>
    </Popup>)}
    </>
      ))}
        {
        newPlace && ( 
        <Popup longitude={newPlace.long} latitude={newPlace.lat}
              anchor="bottom" onClose={()=>setNewPlace(null)}>
                <div>
                  <form onSubmit={handleSubmit}>
                    <label>Title</label>
                    <input placeholder="add a title" onChange={(e)=>setTitle(e.target.value)}/>
                    <label>Review</label>
                    <textarea placeholder="add a description" onChange={(e)=>setReview(e.target.value)}/>
                    <label>Rating</label>
                    <select onChange={(e)=>setRating(e.target.value)}>
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                    </select>
                    <button className="submitButton" type="submit">Add Pin</button>
                  </form>
                </div>
        </Popup> 
        )}
        {currentUser?(<button className="button logout" onClick={handleLogout}>Logout</button>):
        ( <div className="buttons">
        <button className="button login" onClick={()=>setShowLogin(true)}>Login</button>
        <button className="button register"onClick={()=>setShowRegister(true)}>Register</button>
        </div>)}
        {showRegister && <Register setShowRegister={setShowRegister}/>}
        {showLogin && <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser}/>}
       
      </Map>
    </div>
  );
}

export default App;
