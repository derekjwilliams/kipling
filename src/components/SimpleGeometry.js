import React, { Component } from "react"
import { geoMercator, geoPath} from "d3-geo"

class SimpleGeometry extends Component {
  constructor(props) {
    super(props)
    this.state = {
      geometry: props.geometry,
    }
    this.boundaryBoxRef = React.createRef()
  }

  componentDidMount() {
    this.setState({geometry: this.state.geometry})
  }

  draw() {
    if (this.boundaryBoxRef.current) {
  	  const width = this.boundaryBoxRef.current.offsetWidth
  	  const height = this.boundaryBoxRef.current.offsetHeight
      const features = [{"type": "Feature", "geometry": this.state.geometry}]
    	const projection = geoMercator().fitSize([Math.min(width, height), Math.min(width, height)], { "type": "FeatureCollection", features })
      const pathGenerator = geoPath().projection(projection)
       
      this.path = features
        .map((d, i) => {
          return <path
            d={pathGenerator(d)}
            className="geometry"
        />})
    }
  }

  getSize() {
    if (this.boundaryBoxRef.current) {
      return Math.min(this.boundaryBoxRef.current.offsetWidth, this.boundaryBoxRef.current.offsetHeight)
    }
    return 100 // a non zero default, should never be used in actual rendering
  }

  render() {
    const pad = 4
    this.draw();
    return (
      <div ref={this.boundaryBoxRef} className='simple-geometry-boundary'>
        <svg viewBox={`${-pad} ${-pad} ${this.getSize()+pad*2} ${this.getSize()+pad*2}`} ref={(mapSVG) => this.mapSVG = mapSVG}>
          <g>{this.path}</g>
        </svg>
      </div>
    )
  }
}

export default SimpleGeometry

