import React from 'react';
import Footer from './Footer';
import Header from './Header';

const Layout = ({children}) => {
  return (
    <div>
        <Header />
        <div className="content">{children}</div>
        
     </div>
  );
};

export default Layout;