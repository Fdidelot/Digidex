import * as React from 'react'
const test = 2;

export class CatchDigimon extends React.PureComponent<{}, {}> {


    render() {
        return (
            <div>
                <div>{test}</div>
                <div>Je suis la base de tout composant react</div>
            </div>
        )
    }
}

