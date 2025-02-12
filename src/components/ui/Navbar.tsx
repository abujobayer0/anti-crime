import React from 'react';
import { Input } from './input';

const Navbar = () => {
  return (
    <nav className='w-full shadow flex justify-end py-3'>
        <div>
        <Input placeholder='Search...' className='w-[300px] mx-5'/>
        </div>
    </nav>
  );
};

export default Navbar;
