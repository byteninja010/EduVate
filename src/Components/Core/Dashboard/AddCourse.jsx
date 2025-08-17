import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { VscArrowLeft, VscCloudUpload } from 'react-icons/vsc'
import { createCourse } from '../../../services/operations/courseDetailsApi'
import { apiConnector } from '../../../services/apiconnector'
import { categories } from '../../../services/apis'
import ConfirmationModal from '../../Common/ConfirmationModal'

const AddCourse = () => {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState(null)
  const [categoriesList, setCategoriesList] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [categoriesError, setCategoriesError] = useState(false)
  const [formData, setFormData] = useState({
    courseName: '',
    courseDescription: '',
    whatYouWillLearn: '',
    price: '',
    category: '',
    tag: '',
    thumbnailImage: null
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true)
      setCategoriesError(false)
      console.log('Starting to fetch categories...')
      console.log('API endpoint:', categories.SHOW_ALL_CATEGORIES)
      console.log('Full URL being called:', categories.SHOW_ALL_CATEGORIES)
      
      const response = await apiConnector("GET", categories.SHOW_ALL_CATEGORIES)
      console.log('API response received:', response)
      console.log('Response status:', response.status)
      console.log('Response data:', response.data)
      
      if (response.data.success) {
        setCategoriesList(response.data.allCategorys)
        console.log('Categories loaded successfully:', response.data.allCategorys)
      } else {
        console.error('API response not successful:', response.data)
        setCategoriesError(true)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      console.error('Error details:', error.response || error.message)
      console.error('Error stack:', error.stack)
      setCategoriesError(true)
      setCategoriesList([])
    } finally {
      setCategoriesLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setFormData(prev => ({
      ...prev,
      thumbnailImage: file
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.thumbnailImage) {
      alert('Please select a thumbnail image')
      return
    }

    setLoading(true)
    try {
      const data = new FormData()
      data.append('courseName', formData.courseName)
      data.append('courseDescription', formData.courseDescription)
      data.append('whatYouWillLearn', formData.whatYouWillLearn)
      data.append('price', formData.price)
      data.append('category', formData.category)
      data.append('tag', formData.tag)
      data.append('thumbnailImage', formData.thumbnailImage)

      const response = await createCourse(data, token)
      console.log('Create course response:', response)
      
      // Check for both 'success' and 'sucess' (typo from backend)
      if (response && (response.success || response.sucess)) {
        navigate('/dashboard/my-courses')
      } else {
        console.error('Course creation failed:', response)
        // Show error message to user
        alert(response?.message || response?.msg || 'Failed to create course')
      }
    } catch (error) {
      console.error('Failed to create course:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    if (Object.values(formData).some(value => value !== '' && value !== null)) {
      setConfirmationModal({
        txt1: "Are you sure?",
        txt2: "You have unsaved changes. Do you want to leave?",
        btn1Txt: "Leave",
        btn2Txt: "Stay",
        btn1onClick: () => navigate('/dashboard/my-courses'),
        btn2onClick: () => setConfirmationModal(null),
      })
    } else {
      navigate('/dashboard/my-courses')
    }
  }

  return (
    <div className="text-richblack-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-richblack-200 hover:text-richblack-5 transition-colors duration-200 text-sm sm:text-base"
        >
          <VscArrowLeft className="text-base sm:text-lg" />
          <span className="hidden sm:inline">Back to Courses</span>
          <span className="sm:hidden">Back</span>
        </button>
        <div className="hidden sm:block h-6 w-px bg-richblack-600"></div>
        <h1 className="text-2xl sm:text-3xl font-bold text-richblack-5">Create New Course</h1>
      </div>

      {/* Form */}
      <div className="bg-richblack-800 p-4 sm:p-8 rounded-lg border border-richblack-700">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Course Name */}
          <div>
            <label htmlFor="courseName" className="block text-xs sm:text-sm font-medium text-richblack-200 mb-2">
              Course Name *
            </label>
            <input
              type="text"
              id="courseName"
              name="courseName"
              value={formData.courseName}
              onChange={handleInputChange}
              required
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-richblack-700 border border-richblack-600 rounded-lg text-richblack-5 placeholder-richblack-400 focus:outline-none focus:ring-2 focus:ring-yellow-25 focus:border-transparent text-sm sm:text-base"
              placeholder="Enter course name"
            />
          </div>

          {/* Course Description */}
          <div>
            <label htmlFor="courseDescription" className="block text-xs sm:text-sm font-medium text-richblack-200 mb-2">
              Course Description *
            </label>
            <textarea
              id="courseDescription"
              name="courseDescription"
              value={formData.courseDescription}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-richblack-700 border border-richblack-600 rounded-lg text-richblack-5 placeholder-richblack-400 focus:outline-none focus:ring-2 focus:ring-yellow-25 focus:border-transparent text-sm sm:text-base"
              placeholder="Describe what your course is about"
            />
          </div>

          {/* What You Will Learn */}
          <div>
            <label htmlFor="whatYouWillLearn" className="block text-xs sm:text-sm font-medium text-richblack-200 mb-2">
              What You Will Learn *
            </label>
            <textarea
              id="whatYouWillLearn"
              name="whatYouWillLearn"
              value={formData.whatYouWillLearn}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-richblack-700 border border-richblack-600 rounded-lg text-richblack-5 placeholder-richblack-400 focus:outline-none focus:ring-2 focus:ring-yellow-25 focus:border-transparent text-sm sm:text-base"
              placeholder="List the key learning outcomes (use markdown format)"
            />
            <p className="text-xs text-richblack-400 mt-1">
              Use markdown format for better formatting (e.g., **bold**, *italic*, - bullet points)
            </p>
          </div>

          {/* Price and Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-xs sm:text-sm font-medium text-richblack-200 mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-richblack-700 border border-richblack-600 rounded-lg text-richblack-5 placeholder-richblack-400 focus:outline-none focus:ring-2 focus:ring-yellow-25 focus:border-transparent text-sm sm:text-base"
                placeholder="0"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-xs sm:text-sm font-medium text-richblack-200 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-richblack-700 border border-richblack-600 rounded-lg text-richblack-5 focus:outline-none focus:ring-2 focus:ring-yellow-25 focus:border-transparent text-sm sm:text-base"
              >
                <option value="">Select a category</option>
                {categoriesLoading && <option value="">Loading categories...</option>}
                {!categoriesLoading && categoriesError && <option value="">Failed to load categories</option>}
                {!categoriesLoading && !categoriesError && categoriesList && categoriesList.length > 0 && 
                  categoriesList.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))
                }
                {!categoriesLoading && !categoriesError && (!categoriesList || categoriesList.length === 0) && 
                  <option value="">No categories available</option>
                }
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tag" className="block text-xs sm:text-sm font-medium text-richblack-200 mb-2">
              Tags
            </label>
            <input
              type="text"
              id="tag"
              name="tag"
              value={formData.tag}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-richblack-700 border border-richblack-600 rounded-lg text-richblack-5 placeholder-richblack-400 focus:outline-none focus:ring-2 focus:ring-yellow-25 focus:border-transparent text-sm sm:text-base"
              placeholder="Enter tags separated by commas"
            />
            <p className="text-xs text-richblack-400 mt-1">
              Add relevant tags to help students find your course
            </p>
          </div>

          {/* Thumbnail Upload */}
          <div>
            <label htmlFor="thumbnailImage" className="block text-xs sm:text-sm font-medium text-richblack-200 mb-2">
              Course Thumbnail *
            </label>
            <div className="border-2 border-dashed border-richblack-600 rounded-lg p-4 sm:p-6 text-center hover:border-richblack-500 transition-colors duration-200">
              <input
                type="file"
                id="thumbnailImage"
                name="thumbnailImage"
                onChange={handleFileChange}
                accept="image/*"
                required
                className="hidden"
              />
              <label htmlFor="thumbnailImage" className="cursor-pointer">
                <VscCloudUpload className="mx-auto text-3xl sm:text-4xl text-richblack-400 mb-2" />
                <p className="text-richblack-200 mb-1 text-sm sm:text-base">
                  {formData.thumbnailImage ? formData.thumbnailImage.name : 'Click to upload thumbnail'}
                </p>
                <p className="text-xs sm:text-sm text-richblack-400">
                  PNG, JPG, JPEG up to 10MB
                </p>
              </label>
            </div>
            {formData.thumbnailImage && (
              <div className="mt-3">
                <img
                  src={URL.createObjectURL(formData.thumbnailImage)}
                  alt="Preview"
                  className="w-24 h-18 sm:w-32 sm:h-24 object-cover rounded-lg border border-richblack-600"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4 sm:pt-6">
            <button
              type="button"
              onClick={handleBack}
              className="px-4 sm:px-6 py-2 sm:py-3 text-richblack-200 hover:text-richblack-5 transition-colors duration-200 text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 sm:px-8 py-2 sm:py-3 bg-yellow-25 text-richblack-900 rounded-lg font-medium hover:bg-yellow-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {loading ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      {confirmationModal && (
        <ConfirmationModal modalData={confirmationModal} />
      )}
    </div>
  )
}

export default AddCourse
