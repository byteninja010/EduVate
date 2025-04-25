import React from 'react'
import { useSelector } from 'react-redux'
import ChangeProfilePicture from './Settings/ChangeProfilePicture'
import ProfileInformationEdit from './Settings/ProfileInformationEdit'
const Settings = () => {
    const { user } = useSelector((state) => state.profile)
  return (
    <div>
         <h1 className="mb-14 text-3xl font-medium text-richblack-5">
            Edit Profile
         </h1>
          <ChangeProfilePicture/>
          <ProfileInformationEdit/>

     
    </div>
  )
}

export default Settings