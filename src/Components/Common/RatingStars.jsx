import React, { useEffect, useState } from "react"
import { VscStarEmpty, VscStarFull, VscStarHalf } from "react-icons/vsc"

function RatingStars({ Review_Count, Star_Size }) {
  const [starCount, SetStarCount] = useState({
    full: 0,
    half: 0,
    empty: 0,
  })

  useEffect(() => {
    const wholeStars = Math.floor(Review_Count) || 0
    const hasHalfStar = Review_Count % 1 >= 0.5
    
    SetStarCount({
      full: wholeStars,
      half: hasHalfStar ? 1 : 0,
      empty: hasHalfStar ? 4 - wholeStars : 5 - wholeStars,
    })
  }, [Review_Count])

  return (
    <div className="flex gap-1 text-yellow-25">
      {[...new Array(starCount.full)].map((_, i) => {
        return <VscStarFull key={`full-${i}`} size={Star_Size || 20} />
      })}
      {[...new Array(starCount.half)].map((_, i) => {
        return <VscStarHalf key={`half-${i}`} size={Star_Size || 20} className="text-yellow-25/60" />
      })}
      {[...new Array(starCount.empty)].map((_, i) => {
        return <VscStarEmpty key={`empty-${i}`} size={Star_Size || 20} className="text-richblack-400" />
      })}
    </div>
  )
}

export default RatingStars