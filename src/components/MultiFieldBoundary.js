import React, { Component } from "react"
import { geoMercator, geoPath} from "d3-geo"
var topojson = require("topojson")
// import * as topojson from "topojson-client";

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

  projection() {
  	const width = this.boundaryBoxRef.current != null ?
  	                this.boundaryBoxRef.current.offsetWidth :
  	                100

  	const height = this.boundaryBoxRef.current != null ?
  	                this.boundaryBoxRef.current.offsetHeight :
  	                100

  	const projection = geoMercator().fitSize([Math.min(width, height) - 10, Math.min(width, height) - 10], this.state.topofeature)
    return projection  
  }
  
  randomColor() {
    let result = '#';
    for (let i = 0; i < 6; i++) {
      result += '0123456789ABCDEF'[Math.floor(Math.random() * 16)];
    }
    return result
  }

  render() {
  	if (this.state.topofeature.features == null) {
  		return (<div></div>)
  	}
  	const p = this.projection()
    return (
      <div ref={this.boundaryBoxRef} class="multi-field">
        <svg viewBox="-4 -4 100 100">
          <g className="countries">
            {
              this.state.topofeature.features.map((d,i) => (
                <path
                  key={ `path-${ i }` }
                  d={ geoPath().projection(p)(d) }
                  className="field"
              	  fill={this.randomColor()}
                />
              ))
            }
          </g>
        </svg>
      </div>
    )
  }
}
export default MultiFieldBoundary