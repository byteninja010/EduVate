import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { VscArrowLeft, VscAdd, VscEdit, VscTrash, VscChevronDown, VscChevronRight } from 'react-icons/vsc'
import { fetchCourseDetails, createSection, updateSection, deleteSection, createSubSection, updateSubSection, deleteSubSection } from '../../../services/operations/courseDetailsApi'
import ConfirmationModal from '../../Common/ConfirmationModal'

const ManageCourse = () => {
  const { token } = useSelector((state) => state.auth)
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [confirmationModal, setConfirmationModal] = useState(null)
  const [expandedSections, setExpandedSections] = useState(new Set())
  const [editingSection, setEditingSection] = useState(null)
  const [editingSubSection, setEditingSubSection] = useState(null)
  const [showAddSection, setShowAddSection] = useState(false)
  const [showAddSubSection, setShowAddSubSection] = useState(null)

  useEffect(() => {
    fetchCourse()
  }, [courseId, token])

  // Debug state changes
  useEffect(() => {
    console.log('editingSection changed:', editingSection)
  }, [editingSection])

  useEffect(() => {
    console.log('editingSubSection changed:', editingSubSection)
  }, [editingSubSection])

  const fetchCourse = async () => {
    try {
      setLoading(true)
      const response = await fetchCourseDetails(courseId)
      if (response.success) {
        setCourse(response.data.courseDetails)
        // Expand all sections by default
        const sectionIds = response.data.courseDetails.courseContent?.map(section => section._id) || []
        setExpandedSections(new Set(sectionIds))
      }
    } catch (error) {
      console.error('Failed to fetch course:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const handleAddSection = async (formData) => {
    try {
      const data = {
        courseId,
        sectionName: formData.sectionName,
        sectionDescription: formData.sectionDescription
      }
      const response = await createSection(data, token)
      if (response.success) {
        fetchCourse()
        setShowAddSection(false)
      }
    } catch (error) {
      console.error('Failed to create section:', error)
    }
  }

  const handleUpdateSection = async (sectionId, formData) => {
    try {
      const data = {
        sectionId,
        sectionName: formData.sectionName,
        sectionDescription: formData.sectionDescription
      }
      const response = await updateSection(data, token)
      if (response.success) {
        fetchCourse()
        setEditingSection(null)
      }
    } catch (error) {
      console.error('Failed to update section:', error)
    }
  }

  const handleDeleteSection = async (sectionId) => {
    try {
      const response = await deleteSection(sectionId, token)
      if (response.success) {
        fetchCourse()
      }
    } catch (error) {
      console.error('Failed to delete section:', error)
    }
    setConfirmationModal(null)
  }

  const handleAddSubSection = async (sectionId, formData) => {
    try {
      const data = new FormData()
      data.append('sectionId', sectionId)
      data.append('title', formData.title)
      data.append('description', formData.description)
      data.append('videoFile', formData.video) // Changed from 'video' to 'videoFile'
      // Remove timeDuration as backend calculates it automatically

      const response = await createSubSection(data, token)
      if (response.success) {
        fetchCourse()
        setShowAddSubSection(null)
      }
    } catch (error) {
      console.error('Failed to create subsection:', error)
    }
  }

  const handleUpdateSubSection = async (subSectionId, formData) => {
    try {
      const data = new FormData()
      data.append('subSectionId', subSectionId)
      data.append('title', formData.title)
      data.append('description', formData.description)
      if (formData.video) {
        data.append('videoFile', formData.video) // Changed from 'video' to 'videoFile'
      }
      // Remove timeDuration as backend calculates it automatically

      const response = await updateSubSection(data, token)
      if (response.success) {
        fetchCourse()
        setEditingSubSection(null)
      }
    } catch (error) {
      console.error('Failed to update subsection:', error)
    }
  }

  const handleDeleteSubSection = async (subSectionId) => {
    try {
      const response = await deleteSubSection(subSectionId, token)
      if (response.success) {
        fetchCourse()
      }
    } catch (error) {
      console.error('Failed to delete subsection:', error)
    }
    setConfirmationModal(null)
  }

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

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
          onClick={() => navigate('/dashboard/my-courses')}
          className="flex items-center gap-2 text-richblack-200 hover:text-richblack-5 transition-colors duration-200"
        >
          <VscArrowLeft className="text-lg" />
          Back to Courses
        </button>
        <div className="h-6 w-px bg-richblack-600"></div>
        <h1 className="text-3xl font-bold text-richblack-5">Manage Course: {course.courseName}</h1>
      </div>

      {/* Course Overview */}
      <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700 mb-8">
        <div className="flex items-center gap-6">
          <img
            src={course.thumbnail}
            alt={course.courseName}
            className="w-24 h-18 object-cover rounded-lg"
          />
          <div>
            <h2 className="text-xl font-semibold text-richblack-5 mb-2">{course.courseName}</h2>
            <p className="text-richblack-200 text-sm mb-2">{course.courseDescription}</p>
            <div className="flex items-center gap-4 text-sm text-richblack-300">
              <span>{course.courseContent?.length || 0} sections</span>
              <span>
                {course.courseContent?.reduce((acc, section) => 
                  acc + (section.subSection?.length || 0), 0
                )} lectures
              </span>
              <span className="text-yellow-25 font-medium">₹{course.price}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Section Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowAddSection(true)}
          className="flex items-center gap-2 bg-yellow-25 text-richblack-900 px-6 py-3 rounded-lg font-medium hover:bg-yellow-50 transition-all duration-200"
        >
          <VscAdd className="text-lg" />
          Add New Section
        </button>
      </div>

      {/* Sections List */}
      <div className="space-y-4">
        {course.courseContent?.map((section) => (
          <div key={section._id} className="bg-richblack-800 border border-richblack-700 rounded-lg">
            {/* Section Header */}
            <div className="p-4 border-b border-richblack-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleSection(section._id)}
                    className="text-richblack-200 hover:text-richblack-5 transition-colors duration-200"
                  >
                    {expandedSections.has(section._id) ? (
                      <VscChevronDown className="text-lg" />
                    ) : (
                      <VscChevronRight className="text-lg" />
                    )}
                  </button>
                  <h3 className="text-lg font-medium text-richblack-5">{section.sectionName}</h3>
                  <span className="text-sm text-richblack-300">
                    ({section.subSection?.length || 0} lectures)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      console.log('Edit section clicked:', section)
                      setEditingSection(section)
                    }}
                    className="flex items-center gap-1 text-richblue-400 hover:text-richblue-300 transition-colors duration-200"
                  >
                    <VscEdit className="text-sm" />
                    Edit
                  </button>
                  <button
                    onClick={() => setShowAddSubSection(section._id)}
                    className="flex items-center gap-1 text-caribbeangreen-400 hover:text-caribbeangreen-300 transition-colors duration-200"
                  >
                    <VscAdd className="text-sm" />
                    Add Lecture
                  </button>
                  <button
                                         onClick={() => setConfirmationModal({
                       txt1: "Delete Section?",
                       txt2: `Are you sure you want to delete "${section.sectionName}"? This will also delete all lectures in this section.`,
                       btn1Txt: "Delete",
                       btn2Txt: "Cancel",
                       btn1onClick: () => handleDeleteSection(section._id),
                       btn2onClick: () => setConfirmationModal(null),
                     })}
                    className="flex items-center gap-1 text-pink-400 hover:text-pink-300 transition-colors duration-200"
                  >
                    <VscTrash className="text-sm" />
                    Delete
                  </button>
                </div>
              </div>
              {section.sectionDescription && (
                <p className="text-richblack-200 text-sm mt-2 ml-8">
                  {section.sectionDescription}
                </p>
              )}
            </div>

            {/* Subsections */}
            {expandedSections.has(section._id) && (
              <div className="p-4">
                {section.subSection?.length === 0 ? (
                  <p className="text-richblack-300 text-sm text-center py-4">
                    No lectures in this section yet. Add your first lecture!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {section.subSection?.map((subSection) => (
                      <div key={subSection._id} className="flex items-center justify-between p-3 bg-richblack-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-richblue-400 rounded-full"></div>
                          <div>
                            <h4 className="font-medium text-richblack-5">{subSection.title}</h4>
                            <p className="text-sm text-richblack-200">{subSection.description}</p>
                            <p className="text-xs text-richblack-300">{subSection.timeDuration}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              console.log('Edit subsection clicked:', subSection)
                              setEditingSubSection(subSection)
                            }}
                            className="text-richblue-400 hover:text-richblue-300 transition-colors duration-200"
                          >
                            <VscEdit className="text-sm" />
                          </button>
                          <button
                                                       onClick={() => setConfirmationModal({
                             txt1: "Delete Lecture?",
                             txt2: `Are you sure you want to delete "${subSection.title}"?`,
                             btn1Txt: "Delete",
                             btn2Txt: "Cancel",
                             btn1onClick: () => handleDeleteSubSection(subSection._id),
                             btn2onClick: () => setConfirmationModal(null),
                           })}
                            className="text-pink-400 hover:text-pink-300 transition-colors duration-200"
                          >
                            <VscTrash className="text-sm" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Section Modal */}
      {showAddSection && (
        <AddSectionModal
          onClose={() => setShowAddSection(false)}
          onSubmit={handleAddSection}
        />
      )}

      {/* Edit Section Modal */}
      {editingSection && (
        <EditSectionModal
          section={editingSection}
          onClose={() => setEditingSection(null)}
          onSubmit={handleUpdateSection}
        />
      )}

      {/* Add SubSection Modal */}
      {showAddSubSection && (
        <AddSubSectionModal
          sectionId={showAddSubSection}
          onClose={() => setShowAddSubSection(null)}
          onSubmit={handleAddSubSection}
        />
      )}

      {/* Edit SubSection Modal */}
      {editingSubSection && (
        <EditSubSectionModal
          subSection={editingSubSection}
          onClose={() => setEditingSubSection(null)}
          onSubmit={handleUpdateSubSection}
        />
      )}

      {/* Confirmation Modal */}
      {confirmationModal && (
        <ConfirmationModal modalData={confirmationModal} />
      )}
    </div>
  )
}

// Modal Components
const AddSectionModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    sectionName: '',
    sectionDescription: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-richblack-800 p-6 rounded-lg w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Add New Section</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-richblack-200 mb-2">
              Section Name *
            </label>
            <input
              type="text"
              value={formData.sectionName}
              onChange={(e) => setFormData({ ...formData, sectionName: e.target.value })}
              required
              className="w-full px-3 py-2 bg-richblack-700 border border-richblack-600 rounded-lg text-richblack-5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-richblack-200 mb-2">
              Description
            </label>
            <textarea
              value={formData.sectionDescription}
              onChange={(e) => setFormData({ ...formData, sectionDescription: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-richblack-700 border border-richblack-600 rounded-lg text-richblack-5"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-richblack-200 hover:text-richblack-5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-25 text-richblack-900 rounded-lg font-medium"
            >
              Add Section
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const EditSectionModal = ({ section, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    sectionName: section.sectionName,
    sectionDescription: section.sectionDescription || ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(section._id, formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-richblack-800 p-6 rounded-lg w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Edit Section</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-richblack-200 mb-2">
              Section Name *
            </label>
            <input
              type="text"
              value={formData.sectionName}
              onChange={(e) => setFormData({ ...formData, sectionName: e.target.value })}
              required
              className="w-full px-3 py-2 bg-richblack-700 border border-richblack-600 rounded-lg text-richblack-5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-richblack-200 mb-2">
              Description
            </label>
            <textarea
              value={formData.sectionDescription}
              onChange={(e) => setFormData({ ...formData, sectionDescription: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-richblack-700 border border-richblack-600 rounded-lg text-richblack-5"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-richblack-200 hover:text-richblack-5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-25 text-richblack-900 rounded-lg font-medium"
            >
              Update Section
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const AddSubSectionModal = ({ sectionId, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video: null,
    timeDuration: ''
  })
  const [duration, setDuration] = useState('')
  const [isCalculating, setIsCalculating] = useState(false)

  const calculateVideoDuration = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement('video')
      video.preload = 'metadata'
      
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src)
        const duration = Math.floor(video.duration)
        const minutes = Math.floor(duration / 60)
        const seconds = duration % 60
        const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`
        resolve(formattedDuration)
      }
      
      video.src = URL.createObjectURL(file)
    })
  }

  const handleVideoChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setIsCalculating(true)
      try {
        const calculatedDuration = await calculateVideoDuration(file)
        setDuration(calculatedDuration)
        setFormData({ ...formData, video: file, timeDuration: calculatedDuration })
      } catch (error) {
        console.error('Error calculating duration:', error)
        setDuration('Error calculating duration')
      } finally {
        setIsCalculating(false)
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.video) {
      alert('Please select a video file')
      return
    }
    if (!formData.timeDuration) {
      alert('Please wait for duration calculation or select a different video')
      return
    }
    onSubmit(sectionId, formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-richblack-800 p-6 rounded-lg w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Add New Lecture</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-richblack-200 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-3 py-2 bg-richblack-700 border border-richblack-600 rounded-lg text-richblack-5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-richblack-200 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              required
              className="w-full px-3 py-2 bg-richblack-700 border border-richblack-600 rounded-lg text-richblack-5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-richblack-200 mb-2">
              Video File *
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              required
              className="w-full px-3 py-2 bg-richblack-700 border border-richblack-600 rounded-lg text-richblack-5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-richblack-200 mb-2">
              Duration
            </label>
            <div className="w-full px-3 py-2 bg-richblack-700 border border-richblack-600 rounded-lg text-richblack-5 min-h-[42px] flex items-center">
              {isCalculating ? (
                <span className="text-yellow-25">Calculating duration...</span>
              ) : duration ? (
                <span className="text-caribbeangreen-25 font-medium">{duration}</span>
              ) : (
                <span className="text-richblack-400">Select a video to calculate duration</span>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-richblack-200 hover:text-richblack-5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-25 text-richblack-900 rounded-lg font-medium"
            >
              Add Lecture
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const EditSubSectionModal = ({ subSection, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: subSection.title,
    description: subSection.description || '',
    video: null,
    timeDuration: subSection.timeDuration || ''
  })
  const [duration, setDuration] = useState(subSection.timeDuration || '')
  const [isCalculating, setIsCalculating] = useState(false)

  const calculateVideoDuration = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement('video')
      video.preload = 'metadata'
      
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src)
        const duration = Math.floor(video.duration)
        const minutes = Math.floor(duration / 60)
        const seconds = duration % 60
        const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`
        resolve(formattedDuration)
      }
      
      video.src = URL.createObjectURL(file)
    })
  }

  const handleVideoChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setIsCalculating(true)
      try {
        const calculatedDuration = await calculateVideoDuration(file)
        setDuration(calculatedDuration)
        setFormData({ ...formData, video: file, timeDuration: calculatedDuration })
      } catch (error) {
        console.error('Error calculating duration:', error)
        setDuration('Error calculating duration')
      } finally {
        setIsCalculating(false)
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // If a new video is selected, ensure duration is calculated
    if (formData.video && !formData.timeDuration) {
      alert('Please wait for duration calculation or select a different video')
      return
    }
    onSubmit(subSection._id, formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-richblack-800 p-6 rounded-lg w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Edit Lecture</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-richblack-200 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-3 py-2 bg-richblack-700 border border-richblack-600 rounded-lg text-richblack-5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-richblack-200 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              required
              className="w-full px-3 py-2 bg-richblack-700 border border-richblack-600 rounded-lg text-richblack-5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-richblack-200 mb-2">
              Video File (optional)
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="w-full px-3 py-2 bg-richblack-700 border border-richblack-600 rounded-lg text-richblack-5"
            />
            <p className="text-xs text-richblack-400 mt-1">
              Leave empty to keep the current video
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-richblack-200 mb-2">
              Duration
            </label>
            <div className="w-full px-3 py-2 bg-richblack-700 border border-richblack-600 rounded-lg text-richblack-5 min-h-[42px] flex items-center">
              {isCalculating ? (
                <span className="text-yellow-25">Calculating duration...</span>
              ) : duration ? (
                <span className="text-caribbeangreen-25 font-medium">{duration}</span>
              ) : (
                <span className="text-richblack-400">Current: {subSection.timeDuration || 'No duration'}</span>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-richblack-200 hover:text-richblack-5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-25 text-richblack-900 rounded-lg font-medium"
            >
              Update Lecture
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ManageCourse
