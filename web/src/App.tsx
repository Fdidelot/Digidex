import * as React from 'react';
import './App.css';
import ApolloClient, { gql } from "apollo-boost";
import { ApolloProvider, Mutation, MutationFn } from "react-apollo";
import { CatchDigimon } from './pages/CatchDigimon/CatchDigimon';


const client = new ApolloClient({
  uri: "http://localhost:3001/graphql"
});

interface IState {
  name: string;
  type: string;
  digimon?: {
    id: number;
    name: string;
    type: string;
  }
}

const DIGIMON_CREATE = gql`
mutation ($input: CreateDigimonInput!) {
  CreateDigimon(input: $input) {
    id
    name
    type
  }
}
`

// tslint:disable

class App extends React.PureComponent<{}, IState> {
  constructor() {
    super({});

    this.state = {
      name: "",
      type: "",
    }

    this.UpdateName = this.UpdateName.bind(this);
    this.UpdateType = this.UpdateType.bind(this);
    this.createDigimon = this.createDigimon.bind(this);
  }

  public UpdateName(event: any) {
    this.setState({ name: event.target.value });
  }

  public UpdateType(event: any) {
    this.setState({ type: event.target.value });
  }

  public async createDigimon(mutation: MutationFn<{ id: number, name: string, type: string }, { input: { name: string, type: string } }>) {
    const { name, type } = this.state;

    const res = await mutation({
      variables: {
        input: {
          name,
          type
        }
      }
    });

    // @ts-ignore
    const test = res.data.CreateDigimon;

    this.setState({
      // @ts-ignore
      digimon: {
        ...test
      }
    })
  }


  // POUR DU MULTI FILE REACT ROUTEUR ET REACT COMPONENTS
  public render() {
    const { name, type, digimon } = this.state;

    // tslint:disable
    console.log(name, type);
    return (
      <ApolloProvider client={client}>
        <div>
          <h2>My first Apollo app 🚀</h2>
          <Mutation mutation={DIGIMON_CREATE}>
            {(mutateFn) => {
              return (
                <div>
                  <input placeholder="type" onChange={(event) => this.UpdateType(event)} />
                  <input placeholder="name" onChange={(event) => this.UpdateName(event)} />
                  <button className="Button1" onClick={() => this.createDigimon(mutateFn)} />
                </div>
              )
            }}
          </Mutation>
          <div>LE DIGIMON : {JSON.stringify(digimon)}</div>
          <CatchDigimon />
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
