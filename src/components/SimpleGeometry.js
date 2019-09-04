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
      const pathGenerator = geoPath().projection(this.projection())
      this.path = [{"type": "Feature", "geometry": this.state.geometry}]
        .map((d, i) => {
          return <path
            d={pathGenerator(d)}
            className="geometry"
        />})
    }
  }

  getSize() {
    return (this.boundaryBoxRef.current) ?
      Math.min(this.boundaryBoxRef.current.offsetWidth, this.boundaryBoxRef.current.offsetHeight)
    : 100 // a non zero default, should never be used in actual rendering
  }

  projection() {
    const features = [{"type": "Feature", "geometry": this.state.geometry}]
    return (this.boundaryBoxRef.current) ?
      geoMercator().fitSize([this.getSize(), this.getSize()], { "type": "FeatureCollection", features })
    : null // should never be used in actual rendering
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

