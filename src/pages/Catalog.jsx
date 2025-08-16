import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { courseEndpoints, categories } from "../services/apis";
import { apiConnector } from "../services/apiconnector";
import toast from "react-hot-toast";
import CardComponent from "../Components/Core/Courses/CardComponent";
import { VscBook, VscMortarBoard, VscPulse, VscStarFull, VscWatch, VscPerson } from "react-icons/vsc";

const Catalog = () => {
  const { GET_COURSES_BY_CATEGORY } = courseEndpoints;
  const { CATEGORIES_API } = categories;
  const { catalogName } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [categoriesState, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(catalogName || null);
  const [showAllCategories, setShowAllCategories] = useState(!catalogName);

  useEffect(() => {
    fetchCategories();
    if (catalogName) {
      fetchCourseByCategory(catalogName);
    }
  }, [catalogName]);

  const fetchCategories = async () => {
    try {
      console.log("Fetching categories from:", CATEGORIES_API);
      const res = await apiConnector("GET", CATEGORIES_API);
      console.log("Categories response:", res);
      if (res.data.success) {
        setCategories(res.data.allCategorys || []);
        console.log("Categories set:", res.data.allCategorys);
      } else {
        console.error("Categories API failed:", res.data);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      toast.error("Failed to load categories");
    }
  };

  const fetchCourseByCategory = async (categoryName) => {
    setLoading(true);
    try {
      const res = await apiConnector("POST", GET_COURSES_BY_CATEGORY, { catalogName: categoryName });
      if (!res.data.success) {
        throw new Error(res.data.msg);
      }
      setCourses(res.data.data);
      setSelectedCategory(categoryName);
      setShowAllCategories(false);
    } catch (err) {
      toast.error(err.message || "Fetching course Failed");
      console.error(err);
    }
    setLoading(false);
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/catalog/${categoryName}`);
  };

  const handleBackToCategories = () => {
    setShowAllCategories(true);
    setCourses([]);
    setSelectedCategory(null);
    navigate('/catalog');
  };

  // Category icons mapping
  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'JavaScript': '⚡',
      'Python': '🐍',
      'React': '⚛️',
      'Node.js': '🟢',
      'Data Science': '📊',
      'Machine Learning': '🤖',
      'Web Development': '🌐',
      'Mobile Development': '📱',
      'Database': '🗄️',
      'DevOps': '🔧',
      'Cybersecurity': '🔒',
      'Cloud Computing': '☁️',
      'UI/UX': '🎨',
      'Game Development': '🎮',
      'Blockchain': '⛓️',
      'AI': '🧠'
    };
    return iconMap[categoryName] || '📚';
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-richblack-900 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-richblack-300">Loading amazing courses...</p>
        </div>
      </div>
    );
  }

  // Show all categories view
  if (showAllCategories) {
    return (
      <div className="min-h-screen bg-richblack-900">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-richblack-800 via-richblack-900 to-richblack-800">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
          
          <div className="relative max-w-7xl mx-auto px-6 py-20">
            <div className="text-center">
              <div className="mb-6">
                <VscBook className="text-8xl text-yellow-25 mx-auto mb-4" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-richblack-5 mb-6">
                Explore Our
                <span className="text-yellow-25 block">Course Catalog</span>
              </h1>
              <p className="text-xl text-richblack-300 max-w-3xl mx-auto leading-relaxed">
                Discover thousands of courses across various domains. From programming to design, 
                find the perfect course to advance your skills and career.
              </p>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-richblack-5 mb-4">
              Browse by Category
            </h2>
            <p className="text-richblack-300 text-lg">
              Choose your area of interest and start learning
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
            {categoriesState.length > 0 ? (
              categoriesState.map((category) => (
                <div
                  key={category._id}
                  onClick={() => handleCategoryClick(category.name)}
                  className="group cursor-pointer transform transition-all duration-300 hover:scale-105 h-full"
                >
                  <div className="bg-richblack-800 rounded-xl p-6 border border-richblack-700 hover:border-yellow-25/50 hover:shadow-2xl hover:shadow-yellow-25/20 transition-all duration-300 h-full flex flex-col">
                    <div className="text-center flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                          {getCategoryIcon(category.name)}
                        </div>
                        <h3 className="text-xl font-semibold text-richblack-5 mb-3 group-hover:text-yellow-25 transition-colors duration-300">
                          {category.name}
                        </h3>
                        <p className="text-richblack-400 text-sm mb-6 line-clamp-3 leading-relaxed">
                          {category.description || `Explore ${category.name} courses and enhance your skills`}
                        </p>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-yellow-25 text-sm font-medium mt-auto">
                        <VscMortarBoard className="text-lg" />
                        <span>Start Learning</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <div className="text-8xl mb-6">📚</div>
                <h3 className="text-2xl font-semibold text-richblack-300 mb-4">No categories available</h3>
                <p className="text-richblack-400 mb-8 max-w-md mx-auto">
                  We're working on setting up course categories. Please check back later!
                </p>
                <div className="text-richblack-300">
                  <p>Debug info: Categories array length: {categoriesState.length}</p>
                  <p>Categories data: {JSON.stringify(categoriesState)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Stats Section */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-richblack-800 rounded-xl p-6 border border-richblack-700 hover:border-yellow-25/30 hover:shadow-lg hover:shadow-yellow-25/10 transition-all duration-300">
                <VscPulse className="text-4xl text-yellow-25 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-richblack-5 mb-2">500+</h3>
                <p className="text-richblack-300">Courses Available</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-richblack-800 rounded-xl p-6 border border-richblack-700 hover:border-yellow-25/30 hover:shadow-lg hover:shadow-yellow-25/10 transition-all duration-300">
                <VscPerson className="text-4xl text-yellow-25 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-richblack-5 mb-2">50K+</h3>
                <p className="text-richblack-300">Students Enrolled</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-richblack-800 rounded-xl p-6 border border-richblack-700 hover:border-yellow-25/30 hover:shadow-lg hover:shadow-yellow-25/10 transition-all duration-300">
                <VscStarFull className="text-4xl text-yellow-25 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-richblack-5 mb-2">4.8</h3>
                <p className="text-richblack-300">Average Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show specific category courses view
  return (
    <div className="min-h-screen bg-richblack-900">
      {/* Category Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-richblack-800 via-richblack-900 to-richblack-800">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={handleBackToCategories}
              className="flex items-center gap-2 text-richblack-300 hover:text-yellow-25 transition-colors duration-200"
            >
              <VscBook className="text-lg" />
              <span>All Categories</span>
            </button>
            <span className="text-richblack-400">/</span>
            <span className="text-yellow-25 font-medium">{selectedCategory}</span>
          </div>
          
          <div className="text-center">
            <div className="text-6xl mb-6">
              {getCategoryIcon(selectedCategory)}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-richblack-5 mb-4">
              {selectedCategory} Courses
            </h1>
            <p className="text-xl text-richblack-300 max-w-2xl mx-auto">
              Master {selectedCategory} with our comprehensive course collection. 
              From beginners to advanced learners, find the perfect course for your skill level.
            </p>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
                  <div className="mb-8">
            <div>
              <h2 className="text-2xl font-bold text-richblack-5 mb-2">
                Available Courses
              </h2>
              <p className="text-richblack-300">
                {courses.length} course{courses.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>

        {courses.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">📚</div>
            <h3 className="text-2xl font-semibold text-richblack-300 mb-4">No courses found</h3>
            <p className="text-richblack-400 mb-8 max-w-md mx-auto">
              We're working on adding amazing {selectedCategory} courses. Check back soon or explore other categories!
            </p>
            <button
              onClick={handleBackToCategories}
              className="yellowButton"
            >
              Browse All Categories
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
              <CardComponent key={course._id} course={course} />
            ))}
          </div>
        )}

        {/* Back to Categories */}
        <div className="text-center mt-16">
          <button
            onClick={handleBackToCategories}
            className="blackButton"
          >
            <VscBook className="mr-2" />
            Explore More Categories
          </button>
        </div>
      </div>
    </div>
  );
};

export default Catalog;
