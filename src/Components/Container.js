import React from 'react'

const Container = ({children , padding = false, bg = 'white'}) => {
  return (
    <div style={{backgroundColor:bg}} className={padding == true ? 'w-full lg:py-12 py-4  mt-12 px-4 flex float-start items-start flex-col gap-3 min-h-screen':'w-full  pt-2  mt-12  flex float-start items-start flex-col gap-3 min-h-screen'}>
        {children}
    </div>
  )
}

export default Container