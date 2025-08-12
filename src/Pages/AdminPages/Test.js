import React from 'react'

const Test = ({text}) => {
  return (
    <div className='w-full flex items-center justify-center bg-red-500 h-20'>
        <button onClick={()=>{alert(text)}}>Kaydet</button>
    </div>
  )
}

export default Test