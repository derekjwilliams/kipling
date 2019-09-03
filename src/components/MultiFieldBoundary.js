import React, { Component } from "react"
import { geoMercator, geoPath } from "d3-geo"
var topojson = require("topojson")

class MultiFieldBoundary extends Component {
  constructor(props) {
    super(props)
    const topo = topojson.topology({"farmBoundary": props.multiFieldBoundary})
    this.state = {
      fieldBoundary: topo,
      topofeature: topojson.feature(topo, topo.objects.farmBoundary)
    }
    this.boundaryBoxRef = React.createRef();
  }

  componentDidMount() {
  this.setState({
      topofeature: topojson.feature(this.state.fieldBoundary, this.state.fieldBoundary.objects.farmBoundary),
    })
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
  projection() {
    if (this.boundaryBoxRef.current) {
      const width = this.boundaryBoxRef.current.offsetWidth 
      const height = this.boundaryBoxRef.current.offsetHeight
      const projection = geoMercator().fitSize([Math.min(width, height), Math.min(width, height)], this.state.topofeature)
      return projection  
    } return null
  }
  
  render() {
    if (this.state.topofeature.features == null) {
      return (<div></div>)
    }
    
    const pad = 4
    const projection = this.projection()
    return (
      <div ref={this.boundaryBoxRef} class="multi-field">
        <svg viewBox={`${-pad} ${-pad} ${this.getWidth()+pad*2} ${this.getHeight()+pad*2}`}>
          <g className="countries">
            {
              this.state.topofeature.features.map((d,i) => (
                <path
                  key={ `path-${ i }` }
                  d={ geoPath().projection(projection)(d) }
                  className="multi-field"
                  fill={this.randomGreen()}
                />
              ))
            }
          </g>
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
export default MultiFieldBoundary