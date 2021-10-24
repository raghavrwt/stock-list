import React from 'react';
import '../styles/page-layout.css';

const PageLayout = props => {
    return (      
        <div className="page-container">
            {props.children}
        </div>
    )
}

export default PageLayout;