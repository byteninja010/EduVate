import { ACCOUNT_TYPE } from "../utils/constants";
export const sidebarLinks = [
  {
    id: 1,
    name: "Dashboard",
    path: "/dashboard/instructor",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscDashboard",
  },
  {
    id: 2,
    name: "Dashboard",
    path: "/dashboard/student",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscDashboard",
  },
  {
    id: 3,
    name: "My Profile",
    path: "/dashboard/myProfile",
    icon: "VscAccount",
  },
  {
    id: 4,
    name: "My Courses",
    path: "/dashboard/my-courses",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscVm",
  },
  {
    id: 5,
    name: "Add Course",
    path: "/dashboard/add-course",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscAdd",
  },
  {
    id: 6,
    name: "Enrolled Courses",
    path: "/dashboard/enrolled-courses",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscMortarBoard",
  },
  {
    id: 7,
    name: "My Wallet",
    path: "/dashboard/wallet",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscCreditCard",
  },
];
