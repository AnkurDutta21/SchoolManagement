import React from 'react';
import Header from '../Header';
import ProfitAnalysis from '../../pages/Analytics';

const MainLayout = ({ children }) => {
  const isProfitAnalysis = React.isValidElement(children) && children.type === ProfitAnalysis;

  return (
    <>
      <Header />
      {isProfitAnalysis ? (
        <div className='p4 flex flex-col'>
          {children}
        </div>
      ) : (
        <div className="flex flex-col p-4 pt-8">
          {children}
        </div>
      )}
    </>
  );
}

export default MainLayout;
