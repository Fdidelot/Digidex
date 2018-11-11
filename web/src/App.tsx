import * as React from 'react';
import './App.css';

import logo from './logo.svg';

interface IState {
  name: string;
  type: string;
}

// tslint:disable

class App extends React.PureComponent<{}, IState> {
  constructor() {
    super({});

    this.state = {
      name: "",
      type: ""
    }

    this.UpdateName = this.UpdateName.bind(this);
    this.UpdateType = this.UpdateType.bind(this);
    this.create = this.create.bind(this);
  }

  public UpdateName(event: any) {
    this.setState({ name: event.target.value });
  }

  public UpdateType(event: any) {
    this.setState({ type: event.target.value });
  }

  public async create() {
    const { name, type } = this.state;

    console.log("YO")
    const data = await fetch('http://localhost:3001/graphql', {
      method: "POST",
      body: `
      mutation {
        addDigimon(input: {
          name: ${name},
          type: ${type}
        }) {
          id
          name
          type
        }
      }
      `,
    })
    const res = await data.json();
    console.log(res);

    return res;
  }

  public render() {
    const { name, type } = this.state;

    // tslint:disable
    console.log(name, type);
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Salut Quentin</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
        <input placeholder="exemple : Agumon" onChange={(event) => this.UpdateName(event)} />
        <input placeholder="exemple : Virus" onChange={(event) => this.UpdateType(event)} />
        <br />
        <button type="submit" onClick={() => this.create()}>Valider</button>
      </div>
    );
  }
}

export default App;
