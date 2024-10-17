"use client"
import React from 'react';
import Dash from '@/components/Dash';
import { Provider } from 'react-redux';
import { store } from '@/app/store';

const DashWrapper = () => {
  return (
    <Provider store={store}>
      <div className="my-new-page">
        <Dash />
      </div>
    </Provider>
  );
};

export default DashWrapper;
