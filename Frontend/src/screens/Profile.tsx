import { useState } from "react";
import {
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Save,
  X,
} from "lucide-react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Sarah Johnson",
    title: "Senior Software Engineer",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    joinDate: "January 2022",
    bio: "Passionate full-stack developer with 5+ years of experience building scalable web applications. I love working with React, Node.js, and exploring new technologies.",
    skills: ["React", "JavaScript", "TypeScript", "Node.js", "Python", "AWS"],
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  });

  const [editedProfile, setEditedProfile] = useState(profile);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile(profile);
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  interface ProfileData {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    joinDate: string;
    bio: string;
    skills: string[];
    avatar: string;
  }

  type ProfileField = keyof Omit<ProfileData, "skills" | "avatar" | "joinDate">;

  const handleInputChange = (field: ProfileField, value: string) => {
    setEditedProfile((prev: ProfileData) => ({
      ...prev,
      [field]: value,
    }));
  };

  interface SkillsChangeEvent {
    target: {
      value: string;
    };
  }

  const handleSkillsChange = (value: string) => {
    const skills: string[] = value
      .split(",")
      .map((skill: string) => skill.trim())
      .filter((skill: string) => skill);
    setEditedProfile((prev: ProfileData) => ({
      ...prev,
      skills,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 mb-6 text-white">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <img
              src={profile.avatar}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <button className="absolute bottom-2 right-2 bg-white text-gray-600 p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors">
              <Camera size={16} />
            </button>
          </div>

          {/* Basic Info */}
          <div className="flex-1 text-center md:text-left">
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editedProfile.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="text-3xl font-bold bg-white/20 border border-white/30 rounded px-3 py-1 text-white placeholder-white/70 w-full md:w-auto"
                  placeholder="Full Name"
                />
                <input
                  type="text"
                  value={editedProfile.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="text-xl bg-white/20 border border-white/30 rounded px-3 py-1 text-white placeholder-white/70 w-full md:w-auto"
                  placeholder="Job Title"
                />
              </div>
            ) : (
              <div>
                <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
                <p className="text-xl text-white/90 mb-4">{profile.title}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 justify-center md:justify-start mt-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Save size={16} />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEdit}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors backdrop-blur-sm"
                >
                  <Edit2 size={16} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Contact Information */}
        <div className="md:col-span-1">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Contact Info
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-600">
              <Mail size={20} className="text-blue-500" />
              {isEditing ? (
                <input
                  type="email"
                  value={editedProfile.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 flex-1"
                />
              ) : (
                <span>{profile.email}</span>
              )}
            </div>

            <div className="flex items-center gap-3 text-gray-600">
              <Phone size={20} className="text-green-500" />
              {isEditing ? (
                <input
                  type="tel"
                  value={editedProfile.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 flex-1"
                />
              ) : (
                <span>{profile.phone}</span>
              )}
            </div>

            <div className="flex items-center gap-3 text-gray-600">
              <MapPin size={20} className="text-red-500" />
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className="border border-gray-300 rounded px-2 py-1 flex-1"
                />
              ) : (
                <span>{profile.location}</span>
              )}
            </div>

            <div className="flex items-center gap-3 text-gray-600">
              <Calendar size={20} className="text-purple-500" />
              <span>Joined {profile.joinDate}</span>
            </div>
          </div>
        </div>

        {/* Bio and Skills */}
        <div className="md:col-span-2 space-y-6">
          {/* Bio Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">About</h2>
            {isEditing ? (
              <textarea
                value={editedProfile.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 resize-none"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
            )}
          </div>

          {/* Skills Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Skills</h2>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  value={editedProfile.skills.join(", ")}
                  onChange={(e) => handleSkillsChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Enter skills separated by commas"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Separate skills with commas
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
