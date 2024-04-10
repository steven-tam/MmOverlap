'use client';
import { useState, useEffect, useRef } from 'react';


function TabbyCompare({ tabItems }) {
    const [selectedTab, setSelectedTab] = useState(0);
    const firstBtnRef = useRef();
  
    useEffect(() => {
        firstBtnRef.current.focus(); // Focus on the input element when the component mounts
    }, []);
  
    return (
      <div className='bg-sky-100 flex justify-center items-center py-12'>
        <div className='max-w-md flex flex-col gap-y-2 w-full'>
          <div className='bg-blue-400 p-1  rounded-xl flex justify-between items-center gap-x-2 font-bold text-white'>
            {tabItems.map((item, index) => (
              <button
                ref={index === 0 ? firstBtnRef : null}
                key={index}
                onClick={() => setSelectedTab(index)}
                className={`outline-none w-full p-2 hover:bg-blue-300 rounded-xl text-cneter focus:ring-2 focus:bg-white focus:text-blue-600 ${
                  selectedTab === index ? 'ring-2 bg-white text-blue-600' : ''
                } `}
              >
                {item.title}
              </button>
            ))}
          </div>
  
          <div className='bg-white p-2 rounded-xl'>
            {tabItems.map((item, index) => (
              <div className={`${selectedTab === index ? '' : 'hidden'}`}>
                {item.content}
              </div>
            ))}
          </div>
        </div>
      </div>
  )
}

export default TabbyCompare
