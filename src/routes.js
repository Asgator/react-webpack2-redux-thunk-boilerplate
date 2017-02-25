import React, { Component } from 'react';
import { Router, Route, browserHistory } from 'react-router';

import App from 'pages/app';

export default class Routes extends Component {
    render() {
        return (
            <Router history={browserHistory}>
                <Route path="/" component={App} />
            </Router>
        );
    }
}
