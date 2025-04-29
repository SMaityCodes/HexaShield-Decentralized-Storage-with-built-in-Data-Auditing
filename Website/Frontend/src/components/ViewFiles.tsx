import React, { useEffect, useState } from "react";
import { FileText, Download, Search, Filter, SortAsc, SortDesc, Trash2 } from "lucide-react";

interface FileRecord {
  _id: string;
  name: string;
  type: string;
  uploadedAt: string;
  size?: number;
}

const ViewFiles = () => {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);
  const [deletingFile, setDeletingFile] = useState<string | null>(null);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/files");
      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }
      const data = await response.json();
      setFiles(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching files:", error);
      setError("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

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
      setError('Failed to download file');
    } finally {
      setDownloadingFile(null);
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      setDeletingFile(fileId);
      const response = await fetch(`http://localhost:5000/api/files/${fileId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      await fetchFiles(); // Refresh the file list
      setError(null);
    } catch (error) {
      console.error('Delete error:', error);
      setError('Failed to delete file');
    } finally {
      setDeletingFile(null);
    }
  };

  const getFileTypeDisplay = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return 'Image';
    if (mimeType.startsWith('video/')) return 'Video';
    if (mimeType.startsWith('audio/')) return 'Audio';
    if (mimeType.includes('pdf')) return 'PDF';
    if (mimeType.includes('document')) return 'Document';
    return 'File';
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

  const filteredFiles = files
    .filter(file => 
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedType === "all" || getFileTypeDisplay(file.type).toLowerCase() === selectedType.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.uploadedAt).getTime();
      const dateB = new Date(b.uploadedAt).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  const uniqueTypes = ["all", ...new Set(files.map(file => getFileTypeDisplay(file.type).toLowerCase()))];

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700 p-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold text-white">Your Files</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search files..."
                  className="pl-10 pr-4 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-4 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="p-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition-colors"
              >
                {sortOrder === "asc" ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-400 p-4 rounded-lg">
              {error}
            </div>
          )}

          {filteredFiles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-700">
                    <th className="pb-4 text-gray-400 font-medium">File Name</th>
                    <th className="pb-4 text-gray-400 font-medium">Type</th>
                    <th className="pb-4 text-gray-400 font-medium">Uploaded</th>
                    <th className="pb-4 text-gray-400 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.map((file) => (
                    <tr key={file._id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-emerald-400" />
                          <span className="text-white font-medium">{file.name}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="px-3 py-1 bg-emerald-400/10 text-emerald-400 rounded-full text-sm">
                          {getFileTypeDisplay(file.type)}
                        </span>
                      </td>
                      <td className="py-4 text-gray-300">
                        {formatDate(file.uploadedAt)}
                      </td>
                      <td className="py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-gray-700 rounded-lg transition-colors"
                            onClick={() => handleDownload(file._id, file.name)}
                            disabled={downloadingFile === file._id}
                          >
                            <Download className={`w-5 h-5 ${downloadingFile === file._id ? 'animate-bounce' : ''}`} />
                          </button>
                          <button
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                            onClick={() => handleDelete(file._id)}
                            disabled={deletingFile === file._id}
                          >
                            <Trash2 className={`w-5 h-5 ${deletingFile === file._id ? 'animate-spin' : ''}`} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-300 mb-2">No files found</h3>
              <p className="text-gray-400">
                {searchTerm || selectedType !== "all" 
                  ? "Try adjusting your search or filters"
                  : "Upload some files to get started"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewFiles;