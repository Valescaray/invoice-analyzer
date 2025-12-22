import { useState, useCallback } from 'react';
import { Card, Text, Icon } from '@chakra-ui/react';
import { FileUp } from 'lucide-react';
import { formatFileSize } from '../../utils/formatters';

const UploadZone = ({ onFileSelect, acceptedFileTypes, maxFileSize }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);

  const validateFile = (file) => {
    if (!acceptedFileTypes.includes(file.type)) {
      setError('Please upload a PDF or image file');
      return false;
    }
    if (file.size > maxFileSize) {
      setError(`File size must be less than ${formatFileSize(maxFileSize)}`);
      return false;
    }
    setError(null);
    return true;
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  }, [onFileSelect, maxFileSize, acceptedFileTypes]);

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  return (
    <Card.Root
      className={`p-12 text-center cursor-pointer transition-all ${
        isDragging ? 'border-primary-500 bg-primary-50' : 'border-neutral-300 hover:border-primary-400'
      }`}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept={acceptedFileTypes.join(',')}
        onChange={handleFileInput}
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 rounded-full bg-primary-50">
            <Icon color="var(--color-primary-600)">
              <FileUp size={32} />
            </Icon>
          </div>
          <div>
            <Text className="text-lg font-semibold text-neutral-900 mb-2">
              Drag and drop your invoice here
            </Text>
            <Text className="text-sm text-neutral-600">
              or click to browse
            </Text>
            <Text className="text-xs text-neutral-500 mt-2">
              PDF or Image files only • Max {formatFileSize(maxFileSize)}
            </Text>
          </div>
        </div>
      </label>
      {error && (
        <Text className="text-sm text-error-500 mt-4">{error}</Text>
      )}
    </Card.Root>
  );
};

export default UploadZone;