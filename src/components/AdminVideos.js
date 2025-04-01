import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import {
  uploadFileToS3,
  generateUniqueFileName,
  getAllVideos,
  saveVideoMetadata,
  deleteVideo,
  updateVideoArchiveStatus
} from "../components/VideoService";

export default function AdminVideos() {
  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [viewMode, setViewMode] = useState("grid");
  const [showArchived, setShowArchived] = useState(false);

  // Videos collection state
  const [videos, setVideos] = useState([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);

  const router = useRouter();

  useEffect(() => {
    fetchVideos();
  }, [showArchived]);

  // Fetch videos from DynamoDB
  const fetchVideos = async () => {
    setIsLoadingVideos(true);
    try {
      const data = await getAllVideos(showArchived);
      setVideos(data || []);
    } catch (error) {
      console.error("Error fetching videos:", error.message);
      setMessage({
        text: "Failed to load videos. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoadingVideos(false);
    }
  };

  // Handle video file selection
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
    } else {
      setVideoFile(null);
      setMessage({
        text: "Please select a valid video file.",
        type: "error",
      });
    }
  };

  // Handle thumbnail file selection
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setThumbnailFile(file);
    } else {
      setThumbnailFile(null);
      setMessage({
        text: "Please select a valid image file for the thumbnail.",
        type: "error",
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !videoFile || !thumbnailFile) {
      setMessage({
        text: "Please fill in all fields and upload both video and thumbnail.",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      // 1. Upload video to S3
      const videoFileName = generateUniqueFileName(videoFile);
      const videoUrl = await uploadFileToS3(
        videoFile,
        `videos/${videoFileName}`,
        videoFile.type
      );

      // 2. Upload thumbnail to S3
      const thumbnailFileName = generateUniqueFileName(thumbnailFile);
      const thumbnailUrl = await uploadFileToS3(
        thumbnailFile,
        `thumbnails/${thumbnailFileName}`,
        thumbnailFile.type
      );

      // 3. Store video metadata in DynamoDB
      await saveVideoMetadata({
        name,
        description,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
        duration: "", // We'll set this to empty for now
      });

      // 4. Reset form and show success message
      setName("");
      setDescription("");
      setVideoFile(null);
      setThumbnailFile(null);
      // Reset file input fields by clearing their values
      document.getElementById("video").value = "";
      document.getElementById("thumbnail").value = "";
      
      setMessage({
        text: "Video uploaded successfully!",
        type: "success",
      });

      // 5. Refresh the videos list
      fetchVideos();
    } catch (error) {
      console.error("Error uploading video:", error.message);
      setMessage({
        text: `Failed to upload video: ${error.message}`,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle video deletion
  const handleDeleteVideo = async (id, videoUrl, thumbnailUrl) => {
    if (!confirm("Are you sure you want to delete this video?")) return;

    setIsLoading(true);
    try {
      await deleteVideo(id, videoUrl, thumbnailUrl);

      setMessage({
        text: "Video deleted successfully!",
        type: "success",
      });

      // Refresh the videos list
      fetchVideos();
    } catch (error) {
      console.error("Error deleting video:", error.message);
      setMessage({
        text: `Failed to delete video: ${error.message}`,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle archive status toggle
  const handleToggleArchive = async (id, currentStatus) => {
    try {
      await updateVideoArchiveStatus(id, !currentStatus);
      setMessage({
        text: `Video ${!currentStatus ? "archived" : "unarchived"} successfully!`,
        type: "success",
      });
      fetchVideos();
    } catch (error) {
      console.error("Error updating archive status:", error.message);
      setMessage({
        text: `Failed to update archive status: ${error.message}`,
        type: "error",
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Upload New Video</h3>

        {message.text && (
          <div
            className={`p-4 mb-4 rounded-md ${
              message.type === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-black mb-1">
              Video Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EE3224] text-black"
              placeholder="Enter video title"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-black mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EE3224] text-black"
              placeholder="Enter video description"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="video" className="block text-sm font-medium text-black mb-1">
                Video File
              </label>
              <input
                type="file"
                id="video"
                accept="video/*"
                onChange={handleVideoChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EE3224] text-black"
              />
              <p className="mt-1 text-sm text-gray-500">
                Upload MP4, WebM, or other video formats
              </p>
            </div>

            <div>
              <label htmlFor="thumbnail" className="block text-sm font-medium text-black mb-1">
                Thumbnail Image
              </label>
              <input
                type="file"
                id="thumbnail"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EE3224] text-black"
              />
              <p className="mt-1 text-sm text-gray-500">
                Upload JPG, PNG, or other image formats
              </p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 font-medium rounded-md text-white ${
                isLoading ? "bg-gray-400" : "bg-[#EE3224] hover:bg-red-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EE3224]`}
            >
              {isLoading ? "Uploading..." : "Upload Video"}
            </button>
          </div>
        </form>
      </div>

      {/* Videos Display */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Videos Library</h3>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showArchived"
                checked={showArchived}
                onChange={() => setShowArchived(!showArchived)}
                className="h-4 w-4 text-[#EE3224] focus:ring-[#EE3224] border-gray-300 rounded"
              />
              <label htmlFor="showArchived" className="ml-2 text-sm text-gray-700">
                Show archived
              </label>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${
                  viewMode === "grid"
                    ? "bg-[#FEECE7] text-[#EE3224]"
                    : "bg-gray-100 text-gray-600"
                }`}
                aria-label="Grid view"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${
                  viewMode === "list"
                    ? "bg-[#FEECE7] text-[#EE3224]"
                    : "bg-gray-100 text-gray-600"
                }`}
                aria-label="List view"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {isLoadingVideos ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-t-[#EE3224] border-r-[#EE3224] border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
        ) : videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <p className="text-lg">No videos uploaded yet</p>
            <p className="text-sm">Your uploaded videos will appear here</p>
          </div>
        ) : (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className={`bg-gray-50 rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow ${
                      video.archived ? "opacity-60" : ""
                    }`}
                  >
                    <div className="relative h-40 bg-gray-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={video.thumbnail_url}
                        alt={video.name}
                        className="w-full h-full object-cover"
                      />
                      {video.archived && (
                        <div className="absolute top-2 right-2">
                          <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded">
                            Archived
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <a
                          href={video.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#EE3224] text-white p-2 rounded-full hover:bg-red-700"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </a>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium text-gray-900 mb-1 truncate">
                        {video.name}
                      </h4>
                      <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                        {video.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{formatDate(video.created_at)}</span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              handleToggleArchive(video.id, video.archived)
                            }
                            className="text-blue-500 hover:text-blue-700"
                            disabled={isLoading}
                          >
                            {video.archived ? "Unarchive" : "Archive"}
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteVideo(
                                video.id,
                                video.video_url,
                                video.thumbnail_url
                              )
                            }
                            className="text-red-500 hover:text-red-700"
                            disabled={isLoading}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className={`py-4 flex flex-col sm:flex-row ${
                      video.archived ? "opacity-60" : ""
                    }`}
                  >
                    <div className="w-full sm:w-40 h-32 flex-shrink-0 mb-4 sm:mb-0 sm:mr-4 bg-gray-200 rounded-md overflow-hidden relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={video.thumbnail_url}
                        alt={video.name}
                        className="w-full h-full object-cover"
                      />
                      {video.archived && (
                        <div className="absolute top-2 right-2">
                          <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded">
                            Archived
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col">
                      <h4 className="font-medium text-gray-900 mb-1">{video.name}</h4>
                      <p className="text-sm text-gray-500 mb-auto">
                        {video.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
                        <span>{formatDate(video.created_at)}</span>
                        <div className="flex space-x-3">
                          <a
                            href={video.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#EE3224] hover:text-red-700"
                          >
                            Watch
                          </a>
                          <button
                            onClick={() =>
                              handleToggleArchive(video.id, video.archived)
                            }
                            className="text-blue-500 hover:text-blue-700"
                            disabled={isLoading}
                          >
                            {video.archived ? "Unarchive" : "Archive"}
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteVideo(
                                video.id,
                                video.video_url,
                                video.thumbnail_url
                              )
                            }
                            className="text-red-500 hover:text-red-700"
                            disabled={isLoading}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}