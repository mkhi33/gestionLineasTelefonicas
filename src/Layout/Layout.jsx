import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Sidebar from './Sidebar';
const Layout = ({ children }) => {
  const router = useRouter();
  const classesItemActivo = "relative px-4 py-3 flex items-center space-x-4 rounded-xl text-white bg-gradient-to-r bg-black";
  return (
    <div className='flex flex-row'>
      <div className='w-1/5'>
          <Sidebar userRol={2} />
      </div>

      <div className='w-4/5'>
        {children}
      </div>
    </div>
  );
};

export default Layout;
