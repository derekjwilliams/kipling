// src/components/WorldMap.js

import React, { Component } from "react"
import { geoMercator, geoPath} from "d3-geo"



class FieldBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fieldBoundary: props.fieldBoundary,
    }
    this.boundaryBoxRef = React.createRef();
  }

  componentDidMount() {
    this.setState({fieldBoundary: this.state.fieldBoundary})
  }

// for demo purposes only, typically the stroke and fill colors would come from index.css (or elsewhere)
  randomColor() {
    let result = '#';
    for (let i = 0; i < 6; i++) {
      result += '0123456789ABCDEF'[Math.floor(Math.random() * 16)];
    }
    return result
  }

  drawMap() {
  	const width = this.boundaryBoxRef.current != null ?
  	                this.boundaryBoxRef.current.offsetWidth :
  	                1

  	const height = this.boundaryBoxRef.current != null ?
  	                this.boundaryBoxRef.current.offsetHeight :
  	                1
    if (width !== 1) {
      const features = [{"type": "Feature", "geometry": this.state.fieldBoundary}]
      console.log(width)
    	const projection = geoMercator().fitSize([Math.min(width, height) - 10, Math.min(width, height) - 10], { "type": "FeatureCollection", features })
      const pathGenerator = geoPath().projection(projection)
       
      this.fieldPath = features
        .map((d, i) => {
          return <path
            d={pathGenerator(d)}
            stroke={this.randomColor()}
            fill={this.randomColor()}
            className="field"
        />})
    }
  }
  render() {this.drawMap();
    return (
      <div ref={this.boundaryBoxRef} className='field-boundary'>
          <svg viewBox="-5 -5 100 100" ref={(mapSVG) => this.mapSVG = mapSVG}>
              <g>{this.fieldPath}</g>
          </svg>
      </div>
    )
  }
}

export default FieldBoundary