import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Calendar,
  GraduationCap,
  Edit3,
  Save,
  X,
  LogOut,
  Shield,
  Eye,
  EyeOff,
  Check,
  UserCircle,
  Lock,
  Activity,
  Award,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addUserData,
  logedOut,
  updateUserData,
} from "../../state/user/UserSlice";
import { JWTAxios } from "../../api/Axios";
import { toast } from "react-toastify";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.data);

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    username: "",
    age: "",
    grade: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const gradeOptions = [
    { value: "primaryschool", label: "Primary School" },
    { value: "highschool", label: "High School" },
    { value: "undergraduate", label: "Undergraduate" },
    { value: "postgraduate", label: "Postgraduate" },
    { value: "other", label: "Other" },
  ];

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const data = await JWTAxios.get("/user/getprofiledata");
      const response = data.data;

      if (response.success) {
        dispatch(addUserData(response.user));

        setProfileData({
          username: response.user.username || "",
          age: response.user.age || "",
          grade: response.user.grade || "",
        });
      } else {
        toast.error("Profile data geting error", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } catch (err) {
      toast.error("Profile data geting error", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } finally {
      setLoading(false);
    }
  };

  const userStats = user
    ? [
        {
          number: user.groupCount || 0,
          label: "Groups Joined",
          icon: <User className="h-6 w-6" />,
          color: "text-blue-600",
        },
        {
          number: user.noteCount || 0,
          label: "Notes Shared",
          icon: <Activity className="h-6 w-6" />,
          color: "text-green-600",
        },
        {
          number: calculateDaysSinceJoined(user.createdAt),
          label: "Days Active",
          icon: <Clock className="h-6 w-6" />,
          color: "text-purple-600",
        },
        {
          number: engagement(user.groupCount, user.noteCount),
          label: "Engagement",
          icon: <Award className="h-6 w-6" />,
          color: "text-yellow-600",
        },
      ]
    : [];

  function calculateDaysSinceJoined(joinedDate) {
    if (!joinedDate) return 0;
    const joined = new Date(joinedDate);
    const today = new Date();
    const diffTime = Math.abs(today - joined);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  function engagement(groupCount, noteCount) {
    const activeDays = calculateDaysSinceJoined(user.createdAt);
    const totalWorks = groupCount + noteCount;
    const engagement = (totalWorks / activeDays) * 100;
    return engagement.toFixed(2);
  }

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateProfileData = () => {
    if (!profileData.username.trim()) return "Username is required";
    if (
      profileData.age &&
      (isNaN(profileData.age) || profileData.age < 1 || profileData.age > 120)
    ) {
      return "Age must be between 1 and 120";
    }
    if (!profileData.grade) return "Education level is required";
    return null;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const validationError = validateProfileData();
    if (validationError) {
      toast.error(validationError, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }
    setUpdateLoading(true);

    try {
      const data = await JWTAxios.put("/user/updateprofile", profileData);
      const response = data.data;
      if (response.success && response.user) {
        dispatch(updateUserData(response.user));
        setIsEditing(false);
        toast.success("Profile update Success", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        toast.error("Profile update error", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } catch (err) {
      console.log(err);
      toast.error("Profile update error", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Newpassword and Confirmpassword must be same", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }

    if (passwordData.newPassword === passwordData.currentPassword) {
      toast.error("Newpassword and CurrentPassword cant be same", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }

    setPasswordLoading(true);
    try {
      const data = await JWTAxios.put("/user/changepassword", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      const response = data.data;
      if (response.success) {
        setIsChangingPassword(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        toast.success("Password update success", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        toast.error("Password update fail", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } catch (err) {
      toast.error("Password update fail", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const signout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    dispatch(logedOut());
    navigate("/signin");
  };

  const getGradeLabel = (value) => {
    const option = gradeOptions.find((opt) => opt.value === value);
    return option ? option.label : value || "Not specified";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-slate-400">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-6">
              <UserCircle className="h-20 w-20 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {user.username || "User"}
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8">
            {user.email || "No email provided"}
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <Calendar className="h-5 w-5 text-blue-200 inline mr-2" />
              <span className="font-semibold">
                Joined {formatDate(user.createdAt)}
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <GraduationCap className="h-5 w-5 text-green-200 inline mr-2" />
              <span className="font-semibold">{getGradeLabel(user.grade)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Stats Section */}
        <div className="mb-16">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 p-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-8">
              Your Activity
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {userStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="bg-gray-100 dark:bg-slate-700 rounded-full p-3">
                      <div className={stat.color}>{stat.icon}</div>
                    </div>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 dark:text-slate-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Profile Information Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Profile Information
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Personal Details
              </h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  aria-label="Edit profile"
                >
                  <Edit3 size={16} />
                  Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Username */}
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                    >
                      Username
                    </label>
                    <input
                      id="username"
                      type="text"
                      name="username"
                      value={profileData.username}
                      onChange={handleProfileChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      aria-required="true"
                    />
                  </div>

                  {/* Age */}
                  <div>
                    <label
                      htmlFor="age"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                    >
                      Age
                    </label>
                    <input
                      id="age"
                      type="number"
                      name="age"
                      value={profileData.age}
                      onChange={handleProfileChange}
                      min="1"
                      max="120"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      aria-required="false"
                    />
                  </div>

                  {/* Grade */}
                  <div>
                    <label
                      htmlFor="grade"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                    >
                      Education Level
                    </label>
                    <select
                      id="grade"
                      name="grade"
                      value={profileData.grade}
                      onChange={handleProfileChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      aria-required="true"
                    >
                      <option value="">Select education level</option>
                      {gradeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-slate-600">
                  <button
                    type="submit"
                    disabled={updateLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Save profile changes"
                  >
                    {updateLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Save size={16} />
                    )}
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setProfileData({
                        username: user.username || "",

                        age: user.age || "",
                        grade: user.grade || "",
                      });
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    aria-label="Cancel profile editing"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 p-6 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-3">
                    <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-slate-400">
                      Username
                    </p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {user.username || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-6 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-3">
                    <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-slate-400">
                      Email
                    </p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {user.email || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-6 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full p-3">
                    <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-slate-400">
                      Age
                    </p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {user.age ? `${user.age} years old` : "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-6 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-full p-3">
                    <GraduationCap className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-slate-400">
                      Education Level
                    </p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {getGradeLabel(user.grade)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Security Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Security Settings
            </h2>
            <p className="text-gray-600 dark:text-slate-400 text-lg">
              Manage your account security and password
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Password Management
              </h3>
              {!isChangingPassword && (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  aria-label="Change password"
                >
                  <Lock size={16} />
                  Change Password
                </button>
              )}
            </div>

            {isChangingPassword ? (
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  {/* Current Password */}
                  <div>
                    <label
                      htmlFor="currentPassword"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                    >
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        aria-required="true"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400"
                        aria-label={
                          showCurrentPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showCurrentPassword ? (
                          <Eye size={20} />
                        ) : (
                          <EyeOff size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        aria-required="true"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400"
                        aria-label={
                          showNewPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showNewPassword ? (
                          <Eye size={20} />
                        ) : (
                          <EyeOff size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                    >
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        aria-required="true"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400"
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showConfirmPassword ? (
                          <Eye size={20} />
                        ) : (
                          <EyeOff size={20} />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Password must be at least 8 characters long
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-slate-600">
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Update password"
                  >
                    {passwordLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Check size={16} />
                    )}
                    Update Password
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordData({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    aria-label="Cancel password change"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-8">
                <Lock className="h-16 w-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-slate-400">
                  Your password is secure. Last updated on{" "}
                  {formatDate(user.lastPasswordUpdate || user.createdAt)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl text-white p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Account Actions</h2>
          <p className="text-red-100 text-lg mb-8 max-w-2xl mx-auto">
            Ready to sign out? You can always sign back in anytime with your
            credentials.
          </p>
          <button
            onClick={signout}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center gap-3 mx-auto"
            aria-label="Sign out"
          >
            <LogOut size={20} />
            Sign Out of Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
