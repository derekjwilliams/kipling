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

  drawMap() {

  const letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  let strokecolor = '#'
  for (var i = 0; i < 6; i++) {
    strokecolor += letters[Math.floor(Math.random() * 16)];
  }
  	const width = this.boundaryBoxRef.current != null ?
  	                this.boundaryBoxRef.current.offsetWidth :
  	                1;
  	const height = this.boundaryBoxRef.current != null ?
  	                this.boundaryBoxRef.current.offsetHeight :
  	                1;
    const features = [{"type": "Feature", "geometry": this.state.fieldBoundary}]
  	const projection = geoMercator().fitSize([Math.min(width, height) - 10, Math.min(width, height) - 10], { "type": "FeatureCollection", features });
    const pathGenerator = geoPath().projection(projection);
     
    this.fieldPath = features
      .map((d, i) => {
        return <path
          d={pathGenerator(d)}
          stroke={strokecolor}
          fill={color}
          className="field"

      />})
  }
  render() {this.drawMap();
    return (
      <div ref={this.boundaryBoxRef} className='field-boundary'>
          <svg ref={(mapSVG) => this.mapSVG = mapSVG}>
              <g>{this.fieldPath}</g>
          </svg>
      </div>
    )
  }
}

export default FieldBoundary