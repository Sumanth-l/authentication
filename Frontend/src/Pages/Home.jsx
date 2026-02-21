import '../Pages/Home.css'
import Room from './Room.jsx'
import Hotel from './Hotel.jsx'
import Footer from './Footer.jsx'

export default function Home(){
    return(
        <div className="home">
           <Hotel/>
        <Footer />
        </div>
    )
}