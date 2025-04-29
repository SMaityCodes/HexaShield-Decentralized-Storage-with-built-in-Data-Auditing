import React, { useState, useRef, DragEvent, useEffect } from "react";
import { Upload, File, CheckCircle2, Eye, X, AlertCircle, FileText, Clock, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FileWithPreview extends File {
  preview?: string;
}

interface FileRecord {
  _id: string; // Added _id for MongoDB document identification
  name: string;
  type: string;
  uploadedAt: string;
}

const UploadFile = () => {
  const [file, setFile] = useState<FileWithPreview | null>(null);
  const [message, setMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [showViewOption, setShowViewOption] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [recentFiles, setRecentFiles] = useState<FileRecord[]>([]);
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentFiles = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/files');
        if (!response.ok) {
          throw new Error('Failed to fetch recent files');
        }
        const files = await response.json();
        setRecentFiles(files.slice(-5));
      } catch (error) {
        console.error("Error fetching recent files:", error);
      }
    };

    fetchRecentFiles();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      const fileWithPreview = selected as FileWithPreview;
      if (selected.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          fileWithPreview.preview = reader.result as string;
          setFile(fileWithPreview);
        };
        reader.readAsDataURL(selected);
      } else {
        setFile(fileWithPreview);
      }
      setMessage("");
      setShowViewOption(false);
      setUploadProgress(0);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const fileWithPreview = droppedFile as FileWithPreview;
      if (droppedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          fileWithPreview.preview = reader.result as string;
          setFile(fileWithPreview);
        };
        reader.readAsDataURL(droppedFile);
      } else {
        setFile(fileWithPreview);
      }
      setMessage("");
      setShowViewOption(false);
      setUploadProgress(0);
    }
  };

  const realUpload = async () => {
    if (!file) return;
  
    const formData = new FormData();
    formData.append('file', file);
  
    const response = await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      body: formData,
    });
  
    if (!response.ok) throw new Error('Upload failed');
    return response.json();
  };

  const handleDownload = async (fileId: string, fileName: string) => {
    try {
      setDownloadingFile(fileId);
      const response = await fetch(`http://localhost:5000/api/files/${fileId}`);
      
      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      setMessage('❌ Download failed. Please try again.');
    } finally {
      setDownloadingFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    try {
      const fileData = await realUpload();

      setMessage(`✅ "${file.name}" uploaded successfully!`);
      setShowViewOption(true);

      const response = await fetch('http://localhost:5000/api/files');
      const files = await response.json();
      setRecentFiles(files.slice(-5));

      setFile(null);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setMessage("❌ Upload failed. Please try again.");
    }
  };

  const handleViewFiles = () => {
    navigate('/dashboard/view');
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearFile = () => {
    setFile(null);
    setMessage("");
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileTypeIcon = () => {
    if (!file) return <File className="w-16 h-16 text-gray-400 mb-6" />;
    if (file.type.startsWith('image/')) {
      return file.preview ? (
        <img src={file.preview} alt="Preview" className="w-40 h-40 object-cover rounded-lg mb-6" />
      ) : (
        <File className="w-16 h-16 text-gray-400 mb-6" />
      );
    }
    return <FileText className="w-16 h-16 text-emerald-400 mb-6" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFileTypeDisplay = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return 'Image';
    if (mimeType.startsWith('video/')) return 'Video';
    if (mimeType.startsWith('audio/')) return 'Audio';
    if (mimeType.includes('pdf')) return 'PDF';
    if (mimeType.includes('document')) return 'Document';
    return 'File';
  };

  return (
    <div className="text-white p-8 max-w-4xl mx-auto">
      <div className="bg-gray-800/50 backdrop-blur-sm p-10 rounded-2xl shadow-xl border border-gray-700">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Upload className="w-8 h-8 text-emerald-400" />
            <h2 className="text-3xl font-semibold">Upload File</h2>
          </div>
          {recentFiles.length > 0 && (
            <button
              onClick={handleViewFiles}
              className="text-base text-gray-400 hover:text-emerald-400 flex items-center gap-2"
            >
              <Clock className="w-5 h-5" />
              View all files
            </button>
          )}
        </div>

        <div
          className={`relative border-3 border-dashed rounded-xl p-12 transition-all duration-200 ease-in-out ${
            isDragging
              ? "border-emerald-400 bg-emerald-400/10"
              : "border-gray-600 hover:border-gray-500"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
          />
          
          <div className="flex flex-col items-center justify-center text-center">
            {getFileTypeIcon()}
            <p className="text-xl mb-3">
              {file ? (
                <span className="text-emerald-400 flex items-center gap-2">
                  {file.name}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFile();
                    }}
                    className="p-1.5 hover:bg-gray-700 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </span>
              ) : (
                "Drag & drop your file here"
              )}
            </p>
            <p className="text-base text-gray-400">
              or click to browse from your computer
            </p>
          </div>
        </div>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mt-6">
            <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-base text-gray-400 mt-3">Uploading... {uploadProgress}%</p>
          </div>
        )}

        <div className="flex gap-4 mt-8">
          <button
            onClick={handleUpload}
            disabled={!file || uploadProgress > 0}
            className={`flex-1 py-4 px-6 rounded-lg text-lg font-medium flex items-center justify-center gap-3 transition-all duration-200 ${
              file && uploadProgress === 0
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            {file ? (
              <>
                <Upload className="w-6 h-6" />
                Upload File
              </>
            ) : (
              "Select a file first"
            )}
          </button>

          {showViewOption && (
            <button
              onClick={handleViewFiles}
              className="py-4 px-6 rounded-lg text-lg font-medium flex items-center justify-center gap-3 bg-gray-700 hover:bg-gray-600 transition-all duration-200"
            >
              <Eye className="w-6 h-6" />
              View Files
            </button>
          )}
        </div>

        {message && (
          <div className={`mt-6 p-5 rounded-lg flex items-center gap-3 ${
            message.includes("✅") 
              ? "bg-green-500/10 text-green-400"
              : "bg-red-500/10 text-red-400"
          }`}>
            {message.includes("✅") ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <AlertCircle className="w-6 h-6" />
            )}
            <p className="text-lg">{message}</p>
          </div>
        )}

        {recentFiles.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-700">
            <h3 className="text-xl font-medium text-gray-300 mb-4">Recent Uploads</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-700">
                    <th className="pb-3 text-gray-400 font-medium">File Name</th>
                    <th className="pb-3 text-gray-400 font-medium">Type</th>
                    <th className="pb-3 text-gray-400 font-medium">Uploaded</th>
                    <th className="pb-3 text-gray-400 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentFiles.map((fileRecord) => (
                    <tr key={fileRecord._id} className="border-b border-gray-700/50">
                      <td className="py-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-emerald-400" />
                        <span className="text-gray-300">{fileRecord.name}</span>
                      </td>
                      <td className="py-4 text-gray-300">
                        {getFileTypeDisplay(fileRecord.type)}
                      </td>
                      <td className="py-4 text-gray-300">
                        {formatDate(fileRecord.uploadedAt)}
                      </td>
                      <td className="py-4">
                        <button 
                          className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                          onClick={() => handleDownload(fileRecord._id, fileRecord.name)}
                          disabled={downloadingFile === fileRecord._id}
                        >
                          <Download className={`w-4 h-4 ${downloadingFile === fileRecord._id ? 'animate-bounce' : ''}`} />
                          {downloadingFile === fileRecord._id ? 'Downloading...' : 'Download'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadFile;