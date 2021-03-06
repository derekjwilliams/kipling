import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import SimpleGeometry from './components/SimpleGeometry'
import MultiSimpleGeometry from './components/MultiSimpleGeometry'
import * as serviceWorker from './serviceWorker';
import ApolloClient from "apollo-boost";
import { ApolloProvider, Query } from "react-apollo";
import gql from "graphql-tag";

const client = new ApolloClient({
  uri: "http://localhost:5002/graphql"
});

const Geometries = () => (
  <Query
    query={gql`
    {
      allMatchedFarms(first: 500, after:"WyJwcmltYXJ5X2tleV9hc2MiLFsiMDc1ZjVlN2YtYzkyYS00MTk0LTg2MmQtMTA2M2Q0NjIwYTJmIl1d") {
        totalCount
        nodes {
          id
          boundary
          simplifiedBoundary
          
        }
      }
      allMatchedFields(first: 200) {
        nodes {
          id 
          boundary
          simplifiedBoundary
        }
      }
    }
  `}
  >

    {({ loading, error, data }) => {
      if (loading) {
        return <p>Loading...</p>
      }
      if (error) {
        return <p>Error, Oh Noes, check the console</p>
      }

      const multiFieldMaps = data.allMatchedFarms.nodes
        .map(f => JSON.parse(f.boundary))
        .filter(b => b)
        .map((f,i) => 
        <div>
          <MultiSimpleGeometry key={`multi-field-${i}`} geometries={f}></MultiSimpleGeometry> 
        </div>);

      const simpleGeometries = data.allMatchedFields.nodes
        .map(f => JSON.parse(f.boundary))
        .filter(b => b && b.coordinates && b.coordinates.length > 0)
        .map((f,i) => 
        <div key={`field-${i}`} data-index={`index-${i}`}>
          <SimpleGeometry key={i} geometry={f}></SimpleGeometry> 
        </div>);
      
      const simplifiedSimpleGeometries = data.allMatchedFields.nodes
        .map(f => JSON.parse(f.simplifiedBoundary))
        .filter(b => b && b.coordinates && b.coordinates.length > 0)
        .map((f,i) => 
        <div key={`field-${i}`} data-index={`index-${i}`}>
          <SimpleGeometry key={i} geometry={f}></SimpleGeometry> 
        </div>);

      return (
          <div>
            <div className="geometry-collection">{multiFieldMaps}</div>
            <div className="geometry-collection">{simpleGeometries}</div>
          </div>
        )
    }}
  </Query>
);



const App = () => (
  <ApolloProvider client={client}>
    <Geometries />
  </ApolloProvider>
);
ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();


/*  randomGreen() {
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
*/