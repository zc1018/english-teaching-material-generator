import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '../../constants/config';

export default function FileUploadZone({ onFileContent }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    setError(null);
    setSuccess(false);

    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError('文件大小超过10MB限制');
      } else {
        setError('不支持的文件类型');
      }
      return;
    }

    const uploadedFile = acceptedFiles[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      const response = await fetch('http://localhost:3000/api/files/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('文件上传失败');
      }

      const data = await response.json();
      setSuccess(true);
      onFileContent(data.content);
    } catch (err) {
      setError(err.message);
      setFile(null);
    } finally {
      setUploading(false);
    }
  }, [onFileContent]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ALLOWED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: false
  });

  const handleRemove = () => {
    setFile(null);
    setSuccess(false);
    setError(null);
    onFileContent('');
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
          transition-all duration-300
          ${isDragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-slate-200 bg-slate-50/50 hover:border-primary-400 hover:bg-white'
          }
          ${file ? 'opacity-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        <Upload className={`w-12 h-12 mx-auto mb-4 transition-colors ${isDragActive ? 'text-primary-500' : 'text-slate-300'}`} />
        <p className="text-lg font-bold text-slate-700 mb-2">
          {isDragActive ? '释放文件以上传' : '拖拽文件到此处或点击选择'}
        </p>
        <p className="text-sm text-slate-400 font-medium">
          支持 PDF, Word, TXT, HTML 文件, 最大 10MB
        </p>
      </div>

      {file && (
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <File className="w-8 h-8 text-primary-500" />
              <div>
                <p className="font-medium text-gray-800">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {uploading && (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-500 border-t-transparent" />
              )}
              {success && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              <button
                onClick={handleRemove}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          <p className="text-sm text-green-700">文件解析成功!</p>
        </div>
      )}
    </div>
  );
}
