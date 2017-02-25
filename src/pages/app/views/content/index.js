import React from 'react';
import CSSModules from 'react-css-modules';

import styles from './styles.less';

class AppContent extends React.Component {
    render() {
        return (
            <div styleName="wrapper"> <p>Content</p> </div>
        );
    }
}

export default CSSModules(AppContent, styles);
