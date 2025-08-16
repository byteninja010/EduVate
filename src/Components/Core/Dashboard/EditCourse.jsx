import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { VscArrowLeft, VscCloudUpload } from 'react-icons/vsc'
import { fetchCourseDetails, editCourse } from '../../../services/operations/courseDetailsApi'
import { apiConnector } from '../../../services/apiconnector'
import { categories } from '../../../services/apis'
import ConfirmationModal from '../../Common/ConfirmationModal'

const EditCourse = () => {
  const { token } = useSelector((state) => state.auth)
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState(null)
  const [categoriesList, setCategoriesList] = useState([])
  const [course, setCourse] = useState(null)
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
    fetchCourse()
    fetchCategories()
  }, [courseId])

  // Set form data when course changes
  useEffect(() => {
    if (course) {
      console.log('Course changed, setting form data:', course)
      const newFormData = {
        courseName: course.courseName || '',
        courseDescription: course.courseDescription || '',
        whatYouWillLearn: course.whatYouWillLearn || '',
        price: course.price || '',
        category: course.category?._id || course.category || '',
        tag: Array.isArray(course.tags) ? course.tags.join(', ') : (course.tags || ''),
        thumbnailImage: null
      }
      console.log('Setting form data from useEffect:', newFormData)
      setFormData(newFormData)
    }
  }, [course])

  const fetchCourse = async () => {
    try {
      setLoading(true)
      const response = await fetchCourseDetails(courseId)
      console.log('Course details response:', response)
      if (response.success) {
        const courseData = response.data.courseDetails
        console.log('Course data:', courseData)
        setCourse(courseData)
        // Form data will be set by useEffect when course changes
      }
    } catch (error) {
      console.error('Failed to fetch course:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories from:', categories.SHOW_ALL_CATEGORIES)
      const response = await apiConnector("GET", categories.SHOW_ALL_CATEGORIES)
      console.log('Categories API response:', response)
      if (response.data.success) {
        // Backend returns categories in 'allCategorys' (with typo)
        setCategoriesList(response.data.allCategorys || response.data.data || [])
        console.log('Categories set:', response.data.allCategorys || response.data.data)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
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
    
    setSaving(true)
    try {
      const data = new FormData()
      data.append('courseId', courseId)
      data.append('courseName', formData.courseName)
      data.append('courseDescription', formData.courseDescription)
      data.append('whatYouWillLearn', formData.whatYouWillLearn)
      data.append('price', formData.price)
      data.append('category', formData.category)
      data.append('tag', formData.tag)
      if (formData.thumbnailImage) {
        data.append('thumbnailImage', formData.thumbnailImage)
      }

      const response = await editCourse(data, token)
      if (response.success) {
        navigate('/dashboard/my-courses')
      }
    } catch (error) {
      console.error('Failed to update course:', error)
    } finally {
      setSaving(false)
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

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  // Debug: Show current form data
  console.log('Current form data:', formData)
  console.log('Current course:', course)

  if (!course) {
    return (
      <div className="text-center py-16">
        <p className="text-richblack-200">Course not found</p>
      </div>
    )
  }

  return (
    <div className="text-richblack-5">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-richblack-200 hover:text-richblack-5 transition-colors duration-200"
        >
          <VscArrowLeft className="text-lg" />
          Back to Courses
        </button>
        <div className="h-6 w-px bg-richblack-600"></div>
        <h1 className="text-3xl font-bold text-richblack-5">Edit Course: {course.courseName}</h1>
      </div>

      {/* Form */}
      <div className="bg-richblack-800 p-8 rounded-lg border border-richblack-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course Name */}
          <div>
            <label htmlFor="courseName" className="block text-sm font-medium text-richblack-200 mb-2">
              Course Name *
            </label>
            <input
              type="text"
              id="courseName"
              name="courseName"
              value={formData.courseName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-richblack-700 border border-richblack-600 rounded-lg text-richblack-5 placeholder-richblack-400 focus:outline-none focus:ring-2 focus:ring-yellow-25 focus:border-transparent"
              placeholder="Enter course name"
            />
          </div>

          {/* Course Description */}
          <div>
            <label htmlFor="courseDescription" className="block text-sm font-medium text-richblack-200 mb-2">
              Course Description *
            </label>
            <textarea
              id="courseDescription"
              name="courseDescription"
              value={formData.courseDescription}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-3 bg-richblack-700 border border-richblack-600 rounded-lg text-richblack-5 placeholder-richblack-400 focus:outline-none focus:ring-2 focus:ring-yellow-25 focus:border-transparent"
              placeholder="Describe what your course is about"
            />
          </div>

          {/* What You Will Learn */}
          <div>
            <label htmlFor="whatYouWillLearn" className="block text-sm font-medium text-richblack-200 mb-2">
              What You Will Learn *
            </label>
            <textarea
              id="whatYouWillLearn"
              name="whatYouWillLearn"
              value={formData.whatYouWillLearn}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-3 bg-richblack-700 border border-richblack-600 rounded-lg text-richblack-5 placeholder-richblack-400 focus:outline-none focus:ring-2 focus:ring-yellow-25 focus:border-transparent"
              placeholder="List the key learning outcomes (use markdown format)"
            />
            <p className="text-xs text-richblack-400 mt-1">
              Use markdown format for better formatting (e.g., **bold**, *italic*, - bullet points)
            </p>
          </div>

          {/* Price and Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-richblack-200 mb-2">
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
                className="w-full px-4 py-3 bg-richblack-700 border border-richblack-600 rounded-lg text-richblack-5 placeholder-richblack-400 focus:outline-none focus:ring-2 focus:ring-yellow-25 focus:border-transparent"
                placeholder="0"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-richblack-200 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-richblack-700 border border-richblack-600 rounded-lg text-richblack-5 focus:outline-none focus:ring-2 focus:ring-yellow-25 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {categoriesList && categoriesList.length > 0 ? (
                  categoriesList.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))
                ) : (
                  <option value="">Loading categories...</option>
                )}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tag" className="block text-sm font-medium text-richblack-200 mb-2">
              Tags
            </label>
            <input
              type="text"
              id="tag"
              name="tag"
              value={formData.tag}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-richblack-700 border border-richblack-600 rounded-lg text-richblack-5 placeholder-richblack-400 focus:outline-none focus:ring-2 focus:ring-yellow-25 focus:border-transparent"
              placeholder="Enter tags separated by commas"
            />
            <p className="text-xs text-richblack-400 mt-1">
              Add relevant tags to help students find your course
            </p>
          </div>

          {/* Thumbnail Upload */}
          <div>
            <label htmlFor="thumbnailImage" className="block text-sm font-medium text-richblack-200 mb-2">
              Course Thumbnail
            </label>
            <div className="border-2 border-dashed border-richblack-600 rounded-lg p-6 text-center hover:border-richblack-500 transition-colors duration-200">
              <input
                type="file"
                id="thumbnailImage"
                name="thumbnailImage"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <label htmlFor="thumbnailImage" className="cursor-pointer">
                <VscCloudUpload className="mx-auto text-4xl text-richblack-400 mb-2" />
                <p className="text-richblack-200 mb-1">
                  {formData.thumbnailImage ? formData.thumbnailImage.name : 'Click to upload new thumbnail'}
                </p>
                <p className="text-sm text-richblack-400">
                  PNG, JPG, JPEG up to 10MB. Leave empty to keep current thumbnail.
                </p>
              </label>
            </div>
            
            {/* Current Thumbnail Preview */}
            <div className="mt-3">
              <p className="text-sm text-richblack-200 mb-2">Current thumbnail:</p>
              <img
                src={course.thumbnail}
                alt="Current thumbnail"
                className="w-32 h-24 object-cover rounded-lg border border-richblack-600"
              />
            </div>
            
            {/* New Thumbnail Preview */}
            {formData.thumbnailImage && (
              <div className="mt-3">
                <p className="text-sm text-richblack-200 mb-2">New thumbnail:</p>
                <img
                  src={URL.createObjectURL(formData.thumbnailImage)}
                  alt="New thumbnail"
                  className="w-32 h-24 object-cover rounded-lg border border-richblack-600"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-3 text-richblack-200 hover:text-richblack-5 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-yellow-25 text-richblack-900 rounded-lg font-medium hover:bg-yellow-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Updating...' : 'Update Course'}
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

export default EditCourse
