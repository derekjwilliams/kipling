import React, { Component } from "react"
import { geoMercator, geoPath} from "d3-geo"

class FieldBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fieldBoundary: props.fieldBoundary,
    }
    this.boundaryBoxRef = React.createRef()
  }

  componentDidMount() {
    this.setState({fieldBoundary: this.state.fieldBoundary})
  }

  draw() {
    if (this.boundaryBoxRef.current) {
  	  const width = this.boundaryBoxRef.current.offsetWidth
  	  const height = this.boundaryBoxRef.current.offsetHeight
      const features = [{"type": "Feature", "geometry": this.state.fieldBoundary}]
    	const projection = geoMercator().fitSize([Math.min(width, height), Math.min(width, height)], { "type": "FeatureCollection", features })
      const pathGenerator = geoPath().projection(projection)
       
      this.fieldPath = features
        .map((d, i) => {
          return <path
            d={pathGenerator(d)}
            className="field"
            fill={this.randomGreen()}
        />})
    }
  }
  getHeight() {
    if (this.boundaryBoxRef.current) {
      return this.boundaryBoxRef.current.offsetHeight ;
    } return 100
  }
  getWidth() {
    if (this.boundaryBoxRef.current) {
      return this.boundaryBoxRef.current.offsetWidth ;
    } return 100
  }
  render() {
    const pad = 4
    this.draw();
    return (
      <div ref={this.boundaryBoxRef} className='field-boundary'>
        <svg viewBox={`${-pad} ${-pad} ${this.getWidth()+pad*2} ${this.getHeight()+pad*2}`} ref={(mapSVG) => this.mapSVG = mapSVG}>
          <g>{this.fieldPath}</g>
        </svg>
      </div>
    )
  }
  randomGreen() {
    return '#ffffff'
    let result = '#'
    for (let i = 0; i < 2; i++) {
      result += '0123456'[Math.floor(Math.random() * 7)]
    }
    for (let i = 2; i < 4; i++) {
      result += '456789ABCDEF'[Math.floor(Math.random() * 10)]
    }
    for (let i = 4; i < 6; i++) {
      result += '0123456'[Math.floor(Math.random() * 7)]
    }
    return result
  }
}

export default FieldBoundary