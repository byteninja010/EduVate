import React from 'react'
import IconBtn from './IconBtn'
const ConfirmationModal = ({modalData}) => {
  return (
    //Overlaying a white div to make the background dull and blur
    <div className='bg-white fixed inset-0 z-[1000] grid place-items-center overflow-auto bg-opacity-10 backdrop-blur-sm'>
        <div className='bg-richblack-800 w-11/12 max-w-[350px] p-4 flex flex-col gap-y-2 rounded-lg border-[1px] border-richblack-400'>
            <p className='text-2xl text-richblack-5 font-semibold'>{modalData?.txt1}</p>
            <p className='text-richblack-200 font-semibold'>{modalData?.txt2}</p>
            <div className='flex flex-row mt-4 gap-x-7'>
                <IconBtn text={modalData?.btn1Txt} onclick={modalData?.btn1onClick}></IconBtn>
                <button className='bg-richblack-400 text-richblack-900 font-semibold p-2 rounded-lg px-4' onClick={modalData?.btn2onClick}>
                    {modalData?.btn2Txt}
                </button>
            </div>
        </div>
    </div>
  )
}

export default ConfirmationModal