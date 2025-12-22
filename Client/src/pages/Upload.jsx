import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Upload as UploadIcon, FileText, CheckCircle, X, AlertCircle } from 'lucide-react';
import { useAnalyzeInvoiceMutation } from '../api/invoiceApi';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

const Upload = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analyzedData, setAnalyzedData] = useState(null);
  const [analyzeInvoice, { isLoading, isError }] = useAnalyzeInvoiceMutation();

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      setAnalyzedData(null);
      setUploadProgress(0);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const result = await analyzeInvoice(formData).unwrap();
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Backend returns { status: "success", data: {...invoice data...} }
      // So we need to access result.data instead of result.invoice
      if (result && result.data) {
        setAnalyzedData(result.data);
      } else {
        console.error('Unexpected response format:', result);
        setAnalyzedData(null);
      }
    } catch (error) {
      console.error('Failed to analyze invoice:', error);
      setUploadProgress(0);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setAnalyzedData(null);
    setUploadProgress(0);
  };

  const handleSave = () => {
    navigate('/invoices');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Upload Invoice</h1>
        <p className="text-muted-foreground mt-1">
          Upload a PDF or image file to extract invoice data automatically
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!selectedFile && (
          <motion.div
            key="upload-zone"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardContent className="p-0">
                <div
                  {...getRootProps()}
                  className={cn(
                    "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all",
                    isDragActive
                      ? "border-primary bg-primary-50"
                      : "border-border hover:border-primary hover:bg-accent"
                  )}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                      <UploadIcon className="w-8 h-8 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-foreground">
                        {isDragActive ? 'Drop your file here' : 'Drag & drop your invoice here'}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        or click to browse files
                      </p>
                    </div>
                    <div className="flex gap-2 flex-wrap justify-center">
                      <Badge variant="secondary">PDF</Badge>
                      <Badge variant="secondary">PNG</Badge>
                      <Badge variant="secondary">JPG</Badge>
                      <Badge variant="secondary">Max 10MB</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {selectedFile && !analyzedData && (
          <motion.div
            key="file-preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleReset}
                    disabled={isLoading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {isLoading && uploadProgress > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Processing...</span>
                      <span className="font-medium">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}

                {isError && (
                  <div className="mt-4 flex items-center gap-2 p-3 bg-error-50 border border-error-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-error-600" />
                    <p className="text-sm text-error-700">
                      Failed to analyze invoice. Please try again.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    Analyze Invoice
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleReset} disabled={isLoading}>
                Cancel
              </Button>
            </div>
          </motion.div>
        )}

        {analyzedData && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Success Message */}
            <div className="flex items-center gap-3 p-4 bg-success-50 border border-success-200 rounded-lg">
              <CheckCircle className="w-6 h-6 text-success-600" />
              <p className="font-medium text-success-700">
                Invoice analyzed successfully!
              </p>
            </div>

            {/* Extracted Data */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Extracted Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Vendor Name</p>
                    <p className="font-medium">{analyzedData.vendor_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Invoice Number</p>
                    <p className="font-medium">{analyzedData.invoice_number || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{analyzedData.invoice_date || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="font-medium text-lg">
                      {analyzedData.currency || '$'} {analyzedData.total_amount || '0.00'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tax Amount</p>
                    <p className="font-medium">
                      {analyzedData.currency || '$'} {analyzedData.tax_amount || '0.00'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Currency</p>
                    <p className="font-medium">{analyzedData.currency || 'USD'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
              <Button onClick={handleSave} className="gap-2">
                <CheckCircle className="w-4 h-4" />
                Save Invoice
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Upload Another
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Upload;