import Categories from './Categories'
import './Home.css'

const Home = () => {
  return (
    <div className='home'>
      <Categories />
      <div className="problem-set">
        <div className="problem1">
            <span className="label">Level 1</span>
            <span className="title">HTML Inspector</span>
            <button>Start</button>
        </div>

        <div className="problem1">
            <span className="label">Level 2</span>
            <span className="title">HTML Inspector</span>
            <button>Start</button>
        </div>

        <div className="problem1">
            <span className="label">Level 3</span>
            <span className="title">HTML Inspector</span>
            <button>Start</button>
        </div>

        <div className="problem1">
            <span className="label">Level 4</span>
            <span className="title">HTML Inspector</span>
            <button>Start</button>
        </div>
      </div>
    </div>
  )
}

export default Home
