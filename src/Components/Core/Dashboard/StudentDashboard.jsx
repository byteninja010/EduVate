import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { 
  VscMortarBoard, 
  VscGraph, 
  VscCreditCard, 
  VscPlay, 
  VscCalendar,
  VscStarFull,
  VscArrowUp
} from 'react-icons/vsc'
import { getEnrolledCourse } from '../../../services/operations/Settings'
import { getWallet } from '../../../services/operations/walletAPI'

const StudentDashboard = () => {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [wallet, setWallet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCourses: 0,
    avgProgress: 0,
    totalDuration: 0,
    completedLessons: 0
  })

  useEffect(() => {
    fetchDashboardData()
  }, [token])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch enrolled courses
      const coursesResponse = await getEnrolledCourse(token)
      if (coursesResponse?.data?.data) {
        setEnrolledCourses(coursesResponse.data.data)
        calculateStats(coursesResponse.data.data)
      }
      
      // Fetch wallet
      const walletResponse = await getWallet(token)
      if (walletResponse?.success) {
        setWallet(walletResponse.data)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (courses) => {
    if (!courses || courses.length === 0) return

    console.log('All courses data:', courses)

    const totalCourses = courses.length
    const totalProgress = courses.reduce((sum, course) => sum + (course.progressPercentage || 0), 0)
    const avgProgress = Math.round(totalProgress / totalCourses)
    
    // Calculate total duration - handle different formats properly
    const totalDuration = courses.reduce((sum, course) => {
      const duration = course.totalDuration
      console.log('Course duration for', course.courseName, ':', duration, 'Type:', typeof duration)
      
      if (!duration) {
        console.log('No duration found for course:', course.courseName)
        return sum
      }
      
      // If it's already a number, use it directly
      if (typeof duration === 'number') {
        console.log('Using numeric duration:', duration)
        return sum + duration
      }
      
      // If it's a string, try to parse it
      if (typeof duration === 'string') {
        // Handle formats like "2h", "2.5h", "120m", "2h 30m", "8s", "11s", etc.
        const hoursMatch = duration.match(/(\d+(?:\.\d+)?)\s*h/i)
        const minutesMatch = duration.match(/(\d+(?:\.\d+)?)\s*m/i)
        const secondsMatch = duration.match(/(\d+(?:\.\d+)?)\s*s/i)
        
        let hours = 0
        if (hoursMatch) {
          hours += parseFloat(hoursMatch[1]) || 0
        }
        if (minutesMatch) {
          hours += (parseFloat(minutesMatch[1]) || 0) / 60
        }
        if (secondsMatch) {
          hours += (parseFloat(secondsMatch[1]) || 0) / 3600 // Convert seconds to hours
        }
        
        console.log('Parsed duration for', course.courseName, ':', hours, 'hours')
        return sum + hours
      }
      
      console.log('Unknown duration format for course:', course.courseName, duration)
      return sum
    }, 0)
    
    // Calculate completed lessons (rough estimate based on progress)
    const completedLessons = courses.reduce((sum, course) => {
      const progress = course.progressPercentage || 0
      const totalLessons = course.sections?.length || 1
      return sum + Math.round((progress / 100) * totalLessons)
    }, 0)

    console.log('Calculated stats:', { totalCourses, avgProgress, totalDuration, completedLessons })

    setStats({
      totalCourses,
      avgProgress,
      totalDuration,
      completedLessons
    })
  }

  const formatDuration = (hours) => {
    if (!hours || hours < 0.001) return '< 1s'
    if (hours < 0.0167) return `${Math.round(hours * 3600)}s` // Less than 1 minute, show in seconds
    if (hours < 1) return `${Math.round(hours * 60)}m`
    if (hours < 24) {
      const wholeHours = Math.floor(hours)
      const minutes = Math.round((hours - wholeHours) * 60)
      if (minutes === 0) return `${wholeHours}h`
      return `${wholeHours}h ${minutes}m`
    }
    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24
    if (remainingHours < 0.1) return `${days}d`
    return `${days}d ${Math.round(remainingHours)}h`
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'text-caribbeangreen-400'
    if (progress >= 60) return 'text-yellow-25'
    if (progress >= 40) return 'text-orange-400'
    return 'text-pink-400'
  }

  const getProgressBgColor = (progress) => {
    if (progress >= 80) return 'bg-caribbeangreen-400'
    if (progress >= 60) return 'bg-yellow-25'
    if (progress >= 40) return 'bg-orange-400'
    return 'bg-pink-400'
  }

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="text-richblack-5">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-25 to-yellow-50 rounded-full flex items-center justify-center">
            <VscMortarBoard className="text-3xl text-richblack-900" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-richblack-5">
              {getGreeting()}, {user?.firstName || 'Student'}! 👋
            </h1>
            <p className="text-richblack-200 text-lg mt-1">
              Ready to continue your learning journey?
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Courses Enrolled */}
        <div className="bg-gradient-to-br from-richblack-800 to-richblack-700 p-6 rounded-xl border border-richblack-600 hover:border-richblack-500 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <VscMortarBoard className="text-2xl text-white" />
            </div>
            <VscArrowUp className="text-2xl text-blue-400 opacity-60" />
          </div>
          <h3 className="text-richblack-200 text-sm font-medium mb-1">Courses Enrolled</h3>
          <p className="text-3xl font-bold text-blue-400">{stats.totalCourses}</p>
        </div>

        {/* Average Progress */}
        <div className="bg-gradient-to-br from-richblack-800 to-richblack-700 p-6 rounded-xl border border-richblack-600 hover:border-richblack-500 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-caribbeangreen-500 to-caribbeangreen-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <VscGraph className="text-2xl text-white" />
            </div>
            <VscArrowUp className="text-2xl text-caribbeangreen-400 opacity-60" />
          </div>
          <h3 className="text-richblack-200 text-sm font-medium mb-1">Avg. Progress</h3>
          <p className={`text-3xl font-bold ${getProgressColor(stats.avgProgress)}`}>
            {stats.avgProgress}%
          </p>
        </div>

        {/* Total Learning Time */}
        <div className="bg-gradient-to-br from-richblack-800 to-richblack-700 p-6 rounded-xl border border-richblack-600 hover:border-richblack-500 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <VscCalendar className="text-2xl text-white" />
            </div>
            <VscArrowUp className="text-2xl text-purple-400 opacity-60" />
          </div>
          <h3 className="text-richblack-200 text-sm font-medium mb-1">Total Duration</h3>
          <p className="text-3xl font-bold text-purple-400">
            {stats.totalDuration > 0 ? formatDuration(stats.totalDuration) : 'N/A'}
          </p>
          {stats.totalDuration === 0 && (
            <p className="text-xs text-purple-300 mt-1">Duration data not available</p>
          )}
        </div>

        {/* Wallet Balance */}
        <div className="bg-gradient-to-br from-richblack-800 to-richblack-700 p-6 rounded-xl border border-richblack-600 hover:border-richblack-500 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-25 to-yellow-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <VscCreditCard className="text-2xl text-richblack-900" />
            </div>
            <VscArrowUp className="text-2xl text-yellow-25 opacity-60" />
          </div>
          <h3 className="text-richblack-200 text-sm font-medium mb-1">Wallet Balance</h3>
          <p className="text-3xl font-bold text-yellow-25">₹{wallet?.balance || 0}</p>
        </div>
      </div>

      {/* Continue Learning Section */}
      {enrolledCourses.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-richblack-5">Continue Learning</h2>
            <button
              onClick={() => navigate('/dashboard/enrolled-courses')}
              className="text-yellow-25 hover:text-yellow-50 transition-colors font-medium"
            >
              View All Courses →
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.slice(0, 3).map((course) => (
              <div key={course._id} className="bg-gradient-to-br from-richblack-800 to-richblack-700 rounded-xl border border-richblack-600 hover:border-richblack-500 transition-all duration-300 group cursor-pointer overflow-hidden">
                <div className="relative">
                  <img 
                    src={course.thumbnail} 
                    alt={course.courseName}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-richblack-900/80 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-richblack-5 font-semibold text-sm line-clamp-2">
                      {course.courseName}
                    </h3>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-richblack-200 text-xs">{course.totalDuration}</span>
                    <div className="flex items-center gap-1">
                      <VscStarFull className="text-yellow-25 text-sm" />
                      <span className="text-richblack-200 text-xs">4.5</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-richblack-200 mb-1">
                      <span>Progress</span>
                      <span>{course.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-richblack-600 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressBgColor(course.progressPercentage)}`}
                        style={{ width: `${course.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={() => navigate(`/enrolled-course/${course._id}`)}
                    className="w-full flex items-center justify-center gap-2 bg-yellow-25 text-richblack-900 py-2 px-4 rounded-lg font-medium hover:bg-yellow-50 transition-all duration-200 group-hover:scale-105"
                  >
                    <VscPlay className="text-sm" />
                    Continue Learning
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-richblack-800 to-richblack-700 rounded-xl border border-richblack-600 p-6">
        <h2 className="text-xl font-semibold text-richblack-5 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/catalog/Development')}
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-white font-medium"
          >
            <VscMortarBoard className="text-xl" />
            Explore New Courses
          </button>
          
          <button
            onClick={() => navigate('/dashboard/wallet')}
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-25 to-yellow-50 rounded-lg hover:from-yellow-50 hover:to-yellow-100 transition-all duration-200 text-richblack-900 font-medium"
          >
            <VscCreditCard className="text-xl" />
            Manage Wallet
          </button>
          
          <button
            onClick={() => navigate('/dashboard/myProfile')}
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-caribbeangreen-600 to-caribbeangreen-700 rounded-lg hover:from-caribbeangreen-700 hover:to-caribbeangreen-800 transition-all duration-200 text-white font-medium"
          >
            <VscMortarBoard className="text-xl" />
            Update Profile
          </button>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
