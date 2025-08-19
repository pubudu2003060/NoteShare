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
  Settings,
  Shield,
  Eye,
  EyeOff,
  Check,
  UserCircle,
  Lock,
  Activity,
  Award,
  Clock,
} from "lucide-react";

const mockUser = {
  id: "123",
  username: "johndoe",
  email: "john.doe@example.com",
  age: 25,
  grade: "undergraduate",
  joinedDate: "2023-08-15",
  totalGroups: 8,
  notesShared: 24,
  lastActive: "2024-08-19",
};

const Profile = () => {
  // Mock user data - in real app this would come from Redux store
  const [user, setUser] = useState(mockUser);

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
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

  const userStats = [
    {
      number: user.totalGroups,
      label: "Groups Joined",
      icon: <User className="h-6 w-6" />,
      color: "text-blue-600",
    },
    {
      number: user.notesShared,
      label: "Notes Shared",
      icon: <Activity className="h-6 w-6" />,
      color: "text-green-600",
    },
    {
      number: calculateDaysSinceJoined(user.joinedDate),
      label: "Days Active",
      icon: <Clock className="h-6 w-6" />,
      color: "text-purple-600",
    },
    {
      number: "98%",
      label: "Engagement",
      icon: <Award className="h-6 w-6" />,
      color: "text-yellow-600",
    },
  ];

  function calculateDaysSinceJoined(joinedDate) {
    const joined = new Date(joinedDate);
    const today = new Date();
    const diffTime = Math.abs(today - joined);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || "",
        email: user.email || "",
        age: user.age || "",
        grade: user.grade || "",
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setUser({ ...user, ...profileData });
      setIsEditing(false);
      setLoading(false);

      // Mock toast notification
      console.log("Profile updated successfully!");
    }, 1000);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      console.log("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      console.log("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setLoading(false);
      console.log("Password changed successfully!");
    }, 1000);
  };

  const signout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  const getGradeLabel = (value) => {
    const option = gradeOptions.find((opt) => opt.value === value);
    return option ? option.label : value;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!user) {
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
            {user.username}
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8">{user.email}</p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <Calendar className="h-5 w-5 text-blue-200 inline mr-2" />
              <span className="font-semibold">
                Joined {formatDate(user.joinedDate)}
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
                >
                  <Edit3 size={16} />
                  Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={profileData.username}
                      onChange={handleProfileChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={profileData.age}
                      onChange={handleProfileChange}
                      required
                      min="1"
                      max="120"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  {/* Grade */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Education Level
                    </label>
                    <select
                      name="grade"
                      value={profileData.grade}
                      onChange={handleProfileChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
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
                    onClick={handleUpdateProfile}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Save size={16} />
                    )}
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setProfileData({
                        username: user.username || "",
                        email: user.email || "",
                        age: user.age || "",
                        grade: user.grade || "",
                      });
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              </div>
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
                      {user.username}
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
                      {user.email}
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
                      {user.age} years old
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
                >
                  <Lock size={16} />
                  Change Password
                </button>
              )}
            </div>

            {isChangingPassword ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400"
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
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400"
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
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400"
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
                    onClick={handleChangePassword}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Check size={16} />
                    )}
                    Update Password
                  </button>
                  <button
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordData({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Lock className="h-16 w-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-slate-400">
                  Your password is secure. Last updated on{" "}
                  {formatDate(user.lastActive)}
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
