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
  render() {
    this.draw();
    return (
      <div ref={this.boundaryBoxRef} className='field-boundary'>
        <svg viewBox="-4 -4 116 116" ref={(mapSVG) => this.mapSVG = mapSVG}>
          <g>{this.fieldPath}</g>
        </svg>
      </div>
    )
  }
  randomGreen() {
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