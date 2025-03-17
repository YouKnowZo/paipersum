import React from 'react';
import Navbar from '../components/layout/Navbar';

const MainLayout = ({ children }) => {
  return (
    <div>
        <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;
