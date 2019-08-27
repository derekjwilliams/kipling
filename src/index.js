import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import FieldBoundary from './components/FieldBoundary'
import MultiFieldBoundary from './components/MultiFieldBoundary'
import * as serviceWorker from './serviceWorker';
import ApolloClient from "apollo-boost";
import { ApolloProvider, Query } from "react-apollo";
import gql from "graphql-tag";

const client = new ApolloClient({
  uri: "http://localhost:5002/graphql"
});

const multiFieldListStyle = {
  display: "grid",
  backgroundColor: "#bbb",
  gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))"
}
const fieldListStyle = {
  display: "grid",
  backgroundColor: "#bbb",
  gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))"
}

const FieldBoundaries = () => (
  <Query
    query={gql`
    {
      allMatchedFarms(first: 100) {
        nodes {
          id
          boundary
        }
      }
      allMatchedFields(first: 100) {
        nodes {
          id
          boundary
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

      const validMultiFieldNodes = data.allMatchedFarms.nodes.filter(n => n != null)
      const multiFieldBoundaries = validMultiFieldNodes.map(f => JSON.parse(f.boundary)).filter(b => b)
      const multiFieldMaps = multiFieldBoundaries.map((f,i) => 
        <div>
          <MultiFieldBoundary key={i} multiFieldBoundary={f}></MultiFieldBoundary> 
        </div>);

      const validFieldNodes = data.allMatchedFields.nodes.filter(n => n != null)
      const fieldBoundaries = validFieldNodes.map(f => JSON.parse(f.boundary)).filter(b => b && b.coordinates && b.coordinates.length > 0)

      const fieldmaps = fieldBoundaries.map((f,i) => 
        <div>
          <FieldBoundary key={i} fieldBoundary={f}></FieldBoundary> 
        </div>);
      
      return (
          <div>
            <div class="multi-fields-collection" style={multiFieldListStyle}>{multiFieldMaps}</div>
            <div class="fields-collection" style={fieldListStyle}>{fieldmaps}</div></div>
        )
    }}
  </Query>
);



const App = () => (
  <ApolloProvider client={client}>
    <FieldBoundaries />
  </ApolloProvider>
);
ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
