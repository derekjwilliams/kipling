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
  backgroundColor: "#333",
  gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))"
}
const fieldListStyle = {
  display: "grid",
  backgroundColor: "#333",
  gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))"
}

const FieldBoundaries = () => (
  <Query
    query={gql`
    {
      allMatchedFarms(first: 40) {
        totalCount
        nodes {
          id
          boundary
          simplifiedBoundary
          
        }
      }
      allMatchedFields(first: 40) {
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
          <MultiFieldBoundary key={i} multiFieldBoundary={f}></MultiFieldBoundary> 
        </div>);

      const fieldmaps = data.allMatchedFields.nodes
        .map(f => JSON.parse(f.boundary))
        .filter(b => b && b.coordinates && b.coordinates.length > 0)
        .map((f,i) => 
        <div             data-index={`index-${i}`}
>
          <FieldBoundary key={i} fieldBoundary={f}></FieldBoundary> 
        </div>);
      
      return (
          <div>
            <div className="simplified-fields-collection" style={fieldListStyle}>{multiFieldMaps}</div>
            <div className="fields-collection" style={fieldListStyle}>{fieldmaps}</div></div>
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
