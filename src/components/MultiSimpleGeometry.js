import React, { Component } from "react"
import { geoMercator, geoPath } from "d3-geo"
var topojson = require("topojson")

class MultiSimpleGeometry extends Component {
  constructor(props) {
    super(props)
    const topo = topojson.topology({"aggregation": props.geometries})
    this.state = {
      geometryTopo: topo,
      topofeature: topojson.feature(topo, topo.objects.aggregation)
    }
    this.boundaryBoxRef = React.createRef()
  }

  componentDidMount() {
  this.setState({
      topofeature: topojson.feature(this.state.geometryTopo, this.state.geometryTopo.objects.aggregation),
    })
  }

  getSize() {
    return (this.boundaryBoxRef.current) ?
      Math.min(this.boundaryBoxRef.current.offsetWidth, this.boundaryBoxRef.current.offsetHeight)
    : 100 // a non zero default, should never be used in actual rendering
  }

  projection() {
    return (this.boundaryBoxRef.current) ?
      geoMercator().fitSize([this.getSize(), this.getSize()], this.state.topofeature)
    : null // should never be used in actual rendering
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
  
  render() {
    if (this.state.topofeature.features == null) {
      return (<div></div>)
    }
    
    const pad = 4
    const projection = this.projection()
    const size = this.getSize()
    return (
      <div ref={this.boundaryBoxRef} class="multi-geometry">
        <svg viewBox={`${-pad} ${-pad} ${size+pad} ${size+pad}`}>
          <g className="multi-geometries">
            {
              this.state.topofeature.features.map((d,i) => (
                <path
                  key={ `path-${ i }` }
                  d={ geoPath().projection(projection)(d) }
                  className="multi-geometry"
                  fill={this.randomGreen()}
                />
              ))
            }
          </g>
        </svg>
      </div>
    )
  }
}
export default MultiSimpleGeometry