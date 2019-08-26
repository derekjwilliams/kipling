import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import FieldBoundary from './components/FieldBoundary'
import * as serviceWorker from './serviceWorker';
import ApolloClient from "apollo-boost";
import { ApolloProvider, Query } from "react-apollo";
import gql from "graphql-tag";

const client = new ApolloClient({
  uri: "http://localhost:5002/graphql"
});

  const fieldListStyle = {
    display: "grid",
    backgroundColor: "#bbb",
    gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))"
  }

const FieldBoundaries = () => (
  <Query
    query={gql`
    {
    	allMatchedFields (first:6000){
  			nodes {
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

      const validNodes = data.allMatchedFields.nodes.filter(n => n != null)
      const boundaries = validNodes.map(f => JSON.parse(f.boundary)).filter(b => b && b.coordinates && b.coordinates.length > 0)
      const fieldmaps = boundaries.map((f,i) => 
        <div style={{width: '100px', height: '100px'}}>
          <FieldBoundary key={i} fieldBoundary={f}></FieldBoundary> 
        </div>);
      return <div style={fieldListStyle}>{fieldmaps}</div>
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
