import { useParams, Link } from "react-router-dom";
import { useGetTeamByIdQuery } from "../../../app/Api/Slices/teamsApiSlice";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaBuilding,
  FaPhone,
  FaEnvelope,
  FaCalendar,
  FaIdCard,
  FaVenusMars,
  FaGlobe,
  FaUsers,
  FaInfoCircle,
} from "react-icons/fa";
import { formatDate } from "../../../utils/formatDate";

const SingleTeam = () => {
  const { id } = useParams();
  const { data: teamData, isLoading, error } = useGetTeamByIdQuery(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading team details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error Loading Team
          </h2>
          <p className="text-gray-600 mb-4">
            Failed to load team details. Please try again.
          </p>
          <Link
            to="/admins/teams"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Teams
          </Link>
        </div>
      </div>
    );
  }

  if (!teamData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">👥</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Team Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The team you're looking for doesn't exist.
          </p>
          <Link
            to="/admins/teams"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Teams
          </Link>
        </div>
      </div>
    );
  }

  const team = teamData.data || teamData;
  const members = team.members || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/admins/teams"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Teams
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>
              <p className="text-xl text-gray-600 mt-1">{team.name_ar}</p>
              <div className="flex items-center mt-2 space-x-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    team.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {team.status}
                </span>
                <span className="text-sm text-gray-500">
                  Created {formatDate(team.created_at)}
                </span>
              </div>
            </div>

            <div className="mt-4 md:mt-0">
              <Link
                to={`/admins/teams/${id}/edit`}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                Edit Team
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Team Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Team Details Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <FaInfoCircle className="mr-2 text-blue-600" />
                Team Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Basic Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-400">
                        English Name
                      </label>
                      <p className="text-gray-900 font-medium">{team.name}</p>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400">
                        Arabic Name
                      </label>
                      <p
                        className="text-gray-900 font-medium text-right"
                        dir="rtl"
                      >
                        {team.name_ar}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400">
                        Status
                      </label>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          team.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {team.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Location & Branch
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="text-gray-400 mr-3 shrink-0" />
                      <div>
                        <label className="block text-xs text-gray-400">
                          City
                        </label>
                        <p className="text-gray-900 font-medium">
                          {team.city?.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaBuilding className="text-gray-400 mr-3 shrink-0" />
                      <div>
                        <label className="block text-xs text-gray-400">
                          Medical Branch
                        </label>
                        <p className="text-gray-900 font-medium">
                          {team.medical_branch?.name}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400">
                        Branch Email
                      </label>
                      <p className="text-gray-900 font-medium text-sm">
                        {team.medical_branch?.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Members Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <FaUsers className="mr-2 text-blue-600" />
                  Team Members ({members.length})
                </h2>
              </div>

              {members.length > 0 ? (
                <div className="space-y-4">
                  {members.map((member: any) => (
                    <div
                      key={member.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-3">
                            <div className="w-12 h-12 g-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg mr-4">
                              {member.specialist?.name?.charAt(0) || "U"}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 text-lg">
                                {member.specialist?.name}
                              </h3>
                              <p className="text-gray-600 text-sm">
                                {member.specialist?.title}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <FaIdCard className="text-gray-400 mr-2 shrink-0" />
                                <span className="text-gray-600">
                                  ID: {member.specialist?.id_Number}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <FaVenusMars className="text-gray-400 mr-2 shrink-0" />
                                <span className="text-gray-600 capitalize">
                                  {member.specialist?.gender}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <FaGlobe className="text-gray-400 mr-2 shrink-0" />
                                <span className="text-gray-600">
                                  {member.specialist?.nationality}
                                </span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center">
                                <FaPhone className="text-gray-400 mr-2 shrink-0" />
                                <span className="text-gray-600">
                                  {member.specialist?.mobile}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <FaEnvelope className="text-gray-400 mr-2 shrink-0" />
                                <span className="text-gray-600">
                                  {member.specialist?.email}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <FaCalendar className="text-gray-400 mr-2 shrink-0" />
                                <span className="text-gray-600">
                                  {member.specialist?.date_of_birth
                                    ? formatDate(
                                        member.specialist.date_of_birth
                                      )
                                    : "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {member.specialist?.description && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <label className="block text-xs text-gray-400 mb-1">
                                Description
                              </label>
                              <p className="text-gray-700 text-sm">
                                {member.specialist.description}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-6xl mb-4">👤</div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No Members Yet
                  </h3>
                  <p className="text-gray-500">
                    This team doesn't have any members assigned yet.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Summary & Actions */}
          <div className="space-y-6">
            {/* Team Summary Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Team Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Total Members</span>
                  <span className="font-semibold text-blue-600">
                    {members.length}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">City</span>
                  <span className="font-semibold">{team.city?.name}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Medical Branch</span>
                  <span className="font-semibold text-right">
                    {team.medical_branch?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Branch Status</span>
                  <span
                    className={`font-semibold ${
                      team.medical_branch?.status === "ACTIVE"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {team.medical_branch?.status}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Created</span>
                  <span className="font-semibold">
                    {formatDate(team.created_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* Branch Information Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaBuilding className="mr-2 text-blue-600" />
                Branch Details
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Branch Name
                  </label>
                  <p className="text-gray-900 font-medium">
                    {team.medical_branch?.name}
                  </p>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Contact Email
                  </label>
                  <p className="text-gray-900 text-sm">
                    {team.medical_branch?.email}
                  </p>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Phone
                  </label>
                  <p className="text-gray-900 text-sm">
                    {team.medical_branch?.phone}
                  </p>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Mobile
                  </label>
                  <p className="text-gray-900 text-sm">
                    {team.medical_branch?.mobile}
                  </p>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Address
                  </label>
                  <p className="text-gray-900 text-sm">
                    {team.medical_branch?.address || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  to={`/admins/teams/${id}/edit`}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center block"
                >
                  Edit Team
                </Link>
                <Link
                  to="/admins/teams"
                  className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-center block"
                >
                  Back to Teams
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleTeam;
