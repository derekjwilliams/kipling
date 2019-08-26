import React, { Component } from "react";
import { geoMercator, geoPath  } from 'd3-geo';
import usGeoData from './states.geo';

class Map extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mapSize: {width: 0, height: 0},
      usStates: []
    }
  }

  componentDidMount() {
    this.handleResize();
    this.setState({usStates: usGeoData.features});

    window.addEventListener("load", this.handleResize.bind(this));
    window.addEventListener("resize", this.handleResize.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("load", this.handleResize);
    window.removeEventListener("resize", this.handleResize);
  }
  
  handleResize() {
    this.setState({ 
      ...this.state, 
      mapSize: { 
        ...this.state.mapSize, 
        width: this.mapSVG.parentNode.clientWidth,
        height: this.mapSVG.parentNode.clientHeight
      } 
    })
  }

  drawMap() {
    const { height, width } = this.state.mapSize;
    const projection = geoMercator()
      .fitSize([width, height], usGeoData);
  
    const pathGenerator = geoPath().projection(projection);

    this.states = this.state.usStates
      .map((d, idx) => {
        return <path
          key={"path" + idx}
          d={pathGenerator(d)}
          fill="#dedede"
          fillOpacity="0.3"
          stroke="black"
          strokeDasharray="3"
          cursor="pointer"
          className="states"
      />})
  }
  
  render() {
    this.drawMap();
    return (
      <div className='map'>
          <svg width={'100%'} height={'100%'} ref={(mapSVG) => this.mapSVG = mapSVG}>
              <g>{this.states}</g>
          </svg>
      </div>
    )
  }
}

export default Map;