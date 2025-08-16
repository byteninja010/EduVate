import React from "react";
import { useParams } from "react-router-dom";
import { courseEndpoints } from "../services/apis";
import { apiConnector } from "../services/apiconnector";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import CardComponent from "../Components/Core/Courses/CardComponent";
const Catalog = () => {
  const { GET_COURSES_BY_CATEGORY } = courseEndpoints;
  const { catalogName } = useParams();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    const fetchCourseByCategory = async () => { 
      setLoading(true);
      try {
        const res = await apiConnector("POST", GET_COURSES_BY_CATEGORY, { catalogName });
        if (!res.data.success) {
          throw new Error(res.data.msg);
        }
      setCourses(res.data.data);
      } catch (err) {
        toast.error(err.message || "Fetching course Failed");
        console.error(err);
      }
      setLoading(false);
    };
  
    fetchCourseByCategory();
  }, [catalogName]); 
  
  return (
    <div className="min-h-screen bg-richblack-900">
      {loading ? (
        <div className="flex items-center justify-center h-[90vh]">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="mx-auto">
          <div className="p-10 flex flex-col gap-y-4 bg-richblack-800">
            <div className="mt-3">
              <span className="text-richblack-300 text-sm">
                Home / Catalog /{" "}
              </span>
              <span className="text-yellow-50">{catalogName}</span>
            </div>
            <div>
              <h1 className="text-white text-3xl ">{catalogName}</h1>
            </div>
            <div className="mb-3">
              <p className="text-richblack-300 text-md">{`This is a page which contains courses about ${catalogName}`}</p>
            </div>
          </div>
          <div className="text-white w-11/12 mx-auto">
            <h1 className="text-white text-3xl mt-6 mb-8">Most Popular {catalogName} Courses</h1>
            {courses.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📚</div>
                <h2 className="text-2xl font-semibold text-richblack-300 mb-2">No courses found</h2>
                <p className="text-richblack-400">There are currently no courses available in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {courses.map((course, key) => (
                  <CardComponent key={course._id} course={course} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalog;
