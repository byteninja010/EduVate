import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { HiOutlineVideoCamera, HiOutlinePlay, HiOutlineCheckCircle } from "react-icons/hi";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { BiTime } from "react-icons/bi";
import { MdOutlineDescription } from "react-icons/md";
import { markVideoCompleted, getCourseProgress } from "../../../services/operations/courseProgressAPI";
import toast from "react-hot-toast";

const EnrolledCourseViewer = ({ course }) => {
  const { token } = useSelector((state) => state.auth);
  const [activeSections, setActiveSections] = useState([]);
  const [activeSubSection, setActiveSubSection] = useState(null);
  const [videoProgress, setVideoProgress] = useState({});
  const [courseProgress, setCourseProgress] = useState(0);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const videoRef = useRef(null);

  // Debug course data structure
  console.log("🔍 DEBUG - Course data received:", {
    courseId: course._id,
    courseName: course.courseName,
    courseContent: course.courseContent,
    progressPercentage: course.progressPercentage,
    hasSubSections: course.courseContent?.some(section => section.subSection?.length > 0)
  });

  // Load initial course progress - only once when component mounts
  useEffect(() => {
    const loadCourseProgress = async () => {
      try {
        console.log("🔍 DEBUG - Loading course progress for course:", course._id);
        const response = await getCourseProgress(course._id, token);
        console.log("🔍 DEBUG - Course progress response:", response);
        
        if (response.success) {
          const completedVideos = response.data.completedVideos || [];
          console.log("🔍 DEBUG - Completed videos from backend:", completedVideos);
          
          const progressMap = {};
          completedVideos.forEach(videoId => {
            progressMap[videoId] = true;
          });
          
          console.log("🔍 DEBUG - Setting videoProgress to:", progressMap);
          console.log("🔍 DEBUG - Setting courseProgress to:", response.data.progressPercentage);
          
          setVideoProgress(progressMap);
          setCourseProgress(response.data.progressPercentage || 0);
        }
      } catch (error) {
        console.error("Error loading course progress:", error);
        setVideoProgress({});
        setCourseProgress(0);
      }
    };

    if (course._id && token) {
      loadCourseProgress();
    }
  }, []); // Only run once when component mounts

  // Toggle section visibility
  const toggleSection = (sectionId) => {
    setActiveSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Handle subsection selection
  const handleSubSectionSelect = (subSection) => {
    setActiveSubSection(subSection);
  };

  // Mark video as completed
  const handleVideoCompleted = async (subSectionId) => {
    console.log("🔍 DEBUG - handleVideoCompleted called with subSectionId:", subSectionId);
    console.log("🔍 DEBUG - Current videoProgress state:", videoProgress);
    console.log("🔍 DEBUG - Current courseProgress state:", courseProgress);
    
    // Prevent multiple calls if already completed or currently processing
    if (videoProgress[subSectionId] || isMarkingComplete) {
      console.log("🔍 DEBUG - Early return - video already completed or processing");
      return;
    }
    
    setIsMarkingComplete(true);
    
    try {
      console.log("🔍 DEBUG - Calling markVideoCompleted API...");
      const response = await markVideoCompleted(course._id, subSectionId, token);
      console.log("🔍 DEBUG - API response:", response);
      
      if (response.success) {
        console.log("🔍 DEBUG - Video marked successfully, updating local state...");
        
        // Simple state update - add this video to completed list
        setVideoProgress(prev => {
          const newState = { ...prev, [subSectionId]: true };
          console.log("🔍 DEBUG - New videoProgress state:", newState);
          return newState;
        });
        
        // Simple progress calculation
        const totalVideos = course.courseContent?.reduce((total, section) => 
          total + (section.subSection?.length || 0), 0
        ) || 0;
        const currentCompleted = Object.keys(videoProgress).length + 1; // +1 for this video
        const newProgress = totalVideos > 0 ? (currentCompleted / totalVideos) * 100 : 0;
        
        console.log("🔍 DEBUG - Progress calculation:", {
          totalVideos,
          currentCompleted,
          newProgress,
          courseContent: course.courseContent
        });
        
        setCourseProgress(newProgress);
        toast.success("Video marked as completed!");
      }
    } catch (error) {
      console.error("Error marking video as completed:", error);
      // Only show error toast if it's not already completed
      if (!videoProgress[subSectionId]) {
        toast.error("Failed to mark video as completed. Please try again.");
      }
    } finally {
      setIsMarkingComplete(false);
    }
  };

  // Format duration from seconds to readable format
  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    // Convert to number and handle decimals
    const totalSeconds = Math.round(Number(seconds));
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-richblack-900 text-richblack-5">
      {/* Course Header */}
      <div className="bg-richblack-800 border-b border-richblack-700 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Course Thumbnail */}
            <div className="lg:w-1/3">
              <img 
                src={course.thumbnail} 
                alt={course.courseName}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            
            {/* Course Info */}
            <div className="lg:w-2/3 flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-bold text-richblack-5 mb-2">
                  {course.courseName}
                </h1>
                <p className="text-richblack-300 mb-4 line-clamp-3">
                  {course.courseDescription}
                </p>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-richblack-300 mb-2">
                    <span>Course Progress</span>
                    <span>{Math.round(courseProgress)}%</span>
                  </div>
                  <div className="w-full bg-richblack-700 rounded-full h-2">
                    <div 
                      className="bg-yellow-25 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${courseProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {/* Course Stats */}
              <div className="flex flex-wrap gap-4 text-sm text-richblack-300">
                <div className="flex items-center gap-2">
                  <BiTime className="text-yellow-25" />
                  <span>{course.totalDuration || "0:00"}</span>
                </div>
                                 <div className="flex items-center gap-2">
                   <HiOutlineVideoCamera className="text-yellow-25" />
                   <span>{course.courseContent?.reduce((total, section) => 
                     total + (section.subSection?.length || 0), 0
                   ) || 0} lectures</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course Content Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-richblack-800 rounded-lg border border-richblack-700">
              <div className="p-4 border-b border-richblack-700">
                <h3 className="text-lg font-semibold text-richblack-5">
                  Course Content
                </h3>
              </div>
              
              <div className="max-h-[70vh] overflow-y-auto">
                {course.courseContent?.map((section, sectionIndex) => (
                  <div key={section._id} className="border-b border-richblack-700 last:border-b-0">
                    {/* Section Header */}
                    <div 
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-richblack-700 transition-colors"
                      onClick={() => toggleSection(section._id)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-yellow-25 font-medium">
                          Section {sectionIndex + 1}
                        </span>
                        <span className="text-richblack-300">
                          {section.sectionName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-richblack-300">
                          {section.subSection.length} lectures
                        </span>
                        {activeSections.includes(section._id) ? (
                          <AiOutlineUp className="text-richblack-300" />
                        ) : (
                          <AiOutlineDown className="text-richblack-300" />
                        )}
                      </div>
                    </div>
                    
                    {/* Subsection List */}
                    {activeSections.includes(section._id) && (
                      <div className="bg-richblack-900">
                        {section.subSection?.map((subSection, subIndex) => (
                          <div 
                            key={subSection._id}
                            className={`p-3 cursor-pointer transition-colors ${
                              activeSubSection?._id === subSection._id 
                                ? 'bg-richblack-700 border-l-2 border-yellow-25' 
                                : 'hover:bg-richblack-800'
                            }`}
                            onClick={() => handleSubSectionSelect(subSection)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0">
                                {videoProgress[subSection._id] ? (
                                  <HiOutlineCheckCircle className="text-caribbeangreen-100 text-lg" />
                                ) : (
                                  <HiOutlineVideoCamera className="text-richblack-300 text-lg" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-richblack-5 font-medium truncate">
                                  {subIndex + 1}. {subSection.title}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <BiTime className="text-richblack-400 text-xs" />
                                  <span className="text-xs text-richblack-400">
                                    {formatDuration(subSection.timeDuration)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Video Player and Content */}
          <div className="lg:col-span-2">
            {activeSubSection ? (
              <div className="space-y-6">
                {/* Video Player */}
                <div className="bg-richblack-800 rounded-lg border border-richblack-700 overflow-hidden">
                  <div className="aspect-video bg-richblack-900 relative">
                                         {activeSubSection.videoUrl ? (
                       <video
                         ref={videoRef}
                         src={activeSubSection.videoUrl}
                         controls
                         className="w-full h-full"
                         onEnded={() => {
                          // Only mark as completed if not already done
                          if (!videoProgress[activeSubSection._id]) {
                            // Add a small delay to prevent rapid multiple calls
                            setTimeout(() => handleVideoCompleted(activeSubSection._id), 100);
                          }
                        }}
                         onError={(e) => {
                           console.error("Video error:", e);
                         }}
                       />
                     ) : (
                       <div className="flex items-center justify-center h-full">
                         <div className="text-center">
                           <HiOutlineVideoCamera className="text-6xl text-richblack-400 mx-auto mb-4" />
                           <p className="text-richblack-300">Video not available</p>
                         </div>
                       </div>
                     )}
                  </div>
                  
                  {/* Video Controls */}
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <button
                         onClick={() => handleVideoCompleted(activeSubSection._id)}
                         disabled={isMarkingComplete || videoProgress[activeSubSection._id]}
                         className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                           videoProgress[activeSubSection._id]
                             ? 'bg-caribbeangreen-100 text-richblack-900 cursor-not-allowed'
                             : isMarkingComplete
                             ? 'bg-richblack-600 text-richblack-300 cursor-not-allowed'
                             : 'bg-yellow-25 text-richblack-900 hover:bg-yellow-50'
                         }`}
                       >
                         {isMarkingComplete ? (
                           <>
                             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-richblack-900"></div>
                             Processing...
                           </>
                         ) : videoProgress[activeSubSection._id] ? (
                           <>
                             <HiOutlineCheckCircle />
                             Completed
                           </>
                         ) : (
                           <>
                             <HiOutlineCheckCircle />
                             Mark as Complete
                           </>
                         )}
                       </button>
                      <span className="text-sm text-richblack-300">
                        {formatDuration(activeSubSection.timeDuration)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Video Details */}
                <div className="bg-richblack-800 rounded-lg border border-richblack-700 p-6">
                  <h3 className="text-xl font-semibold text-richblack-5 mb-4">
                    {activeSubSection.title}
                  </h3>
                  
                  {activeSubSection.description && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MdOutlineDescription className="text-yellow-25" />
                        <span className="text-richblack-300 font-medium">Description</span>
                      </div>
                      <p className="text-richblack-300 leading-relaxed">
                        {activeSubSection.description}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-richblack-300">
                    <div className="flex items-center gap-2">
                      <BiTime className="text-yellow-25" />
                      <span>Duration: {formatDuration(activeSubSection.timeDuration)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HiOutlineVideoCamera className="text-yellow-25" />
                      <span>Video Lecture</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Default State - No Video Selected */
              <div className="bg-richblack-800 rounded-lg border border-richblack-700 p-12 text-center">
                <HiOutlinePlay className="text-6xl text-richblack-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-richblack-300 mb-2">
                  Select a Lecture
                </h3>
                <p className="text-richblack-400">
                  Choose a lecture from the course content to start learning
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrolledCourseViewer;
