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

const multiGeometryListStyle = {
  display: "grid",
  gridColumnGap: "15px",
  backgroundColor: "#eee",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))"
}
const geometryListStyle = {
  display: "grid",
  gridColumnGap: "15px",
  backgroundColor: "#eee",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))"
}

const Geometries = () => (
  <Query
    query={gql`
    {
      allMatchedFarms(first: 100) {
        totalCount
        nodes {
          id
          boundary
          simplifiedBoundary
          
        }
      }
      allMatchedFields(first: 0) {
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
            <div className="fields-collection" style={geometryListStyle}>{multiFieldMaps}</div>
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
