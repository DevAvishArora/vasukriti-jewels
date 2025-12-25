'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios-instance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  FileText,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';

interface ParsedProduct {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  subCategory?: string;
  sku: string;
  weight?: string;
  materials?: string;
  tags?: string;
  discount?: string;
  comparePrice?: string;
  isFeatured?: string;
  isTrending?: string;
  isNewArrival?: string;
  imageUrl?: string;
  specifications?: string;
  [key: string]: string | undefined;
}

interface UploadResult {
  success: Array<{ row: number; name: string; sku: string; id: string }>;
  errors: Array<{ row: number; name: string; errors: string[] }>;
  total: number;
}

export default function BulkUploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedProduct[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    setFile(selectedFile);
    setError('');
    setUploadResult(null);
    parseCSV(selectedFile);
  };

  const parseCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          setError('CSV file is empty or has no data rows');
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim());
        const data: ParsedProduct[] = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          const product: ParsedProduct = {} as ParsedProduct;
          
          headers.forEach((header, index) => {
            product[header] = values[index] || '';
          });

          data.push(product);
        }

        setParsedData(data);
      } catch (err) {
        setError('Failed to parse CSV file. Please check the format.');
      }
    };

    reader.readAsText(file);
  };

  const handleUpload = async () => {
    if (parsedData.length === 0) {
      setError('No data to upload');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const response = await axiosInstance.post('/products/bulk-upload', {
        products: parsedData,
      });

      setUploadResult(response.data.data);
      
      if (response.data.data.errors.length === 0) {
        setTimeout(() => {
          router.push('/admin/products');
        }, 3000);
      }
    } catch (err: unknown) {
      console.error('Upload error:', err);
      if (err instanceof Error) {
        setError(err.message || 'Failed to upload products');
      }
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const template = `name,description,price,stock,category,subCategory,sku,weight,materials,tags,discount,comparePrice,isFeatured,isTrending,isNewArrival,imageUrl,specifications
Gold Ring,Beautiful 22K gold ring,45000,10,Rings,Gold Rings,GR001,15,Gold,wedding|bridal,5,47000,false,true,false,https://example.com/image1.jpg,Purity:22K|Weight:15g
Diamond Necklace,Stunning diamond necklace,125000,5,Necklaces,Diamond Necklaces,DN001,25,Diamond|Platinum,luxury|diamond,0,125000,true,false,false,https://example.com/image2.jpg,Type:Diamond|Metal:Platinum`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product-upload-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearData = () => {
    setFile(null);
    setParsedData([]);
    setUploadResult(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/admin/products">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Upload className="h-8 w-8" />
          Bulk Product Upload
        </h1>
        <p className="text-sm text-gray-500 mt-1">Upload multiple products using CSV file</p>
      </div>

      {/* Instructions & Template */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-medium">Required Columns:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li><strong>name</strong> - Product name</li>
              <li><strong>price</strong> - Product price (number)</li>
              <li><strong>sku</strong> - Unique SKU code</li>
              <li><strong>stock</strong> - Stock quantity (number)</li>
              <li><strong>category</strong> - Category name (must exist)</li>
            </ul>
            <p className="font-medium mt-4">Optional Columns:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>description, subCategory, weight, materials, tags</li>
              <li>discount, comparePrice, isFeatured, isTrending</li>
              <li>imageUrl, specifications (use | to separate multiple)</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Download Template</CardTitle>
            <CardDescription>Get a pre-formatted CSV template with examples</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={downloadTemplate} className="w-full bg-green-600 hover:bg-green-700">
              <Download className="h-4 w-4 mr-2" />
              Download CSV Template
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Upload Area */}
      {!uploadResult && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Upload CSV File</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                dragActive
                  ? 'border-red-700 bg-red-50'
                  : 'border-gray-300 hover:border-red-700'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <FileSpreadsheet className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium mb-2">
                {file ? file.name : 'Drag and drop your CSV file here'}
              </p>
              <p className="text-sm text-gray-500 mb-4">or</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="mb-2"
              >
                Browse Files
              </Button>
              {file && (
                <Button
                  onClick={clearData}
                  variant="ghost"
                  size="sm"
                  className="ml-2 text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Preview Data */}
      {parsedData.length > 0 && !uploadResult && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Preview Data</CardTitle>
                <CardDescription>{parsedData.length} products ready to upload</CardDescription>
              </div>
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900"
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Products
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedData.slice(0, 10).map((product, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell>₹{product.price}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>{product.category}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {parsedData.length > 10 && (
                <p className="text-sm text-gray-500 mt-4 text-center">
                  ... and {parsedData.length - 10} more products
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Results */}
      {uploadResult && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total Processed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{uploadResult.total}</div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Successful
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-700">{uploadResult.success.length}</div>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-red-700 flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  Failed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-700">{uploadResult.errors.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Success List */}
          {uploadResult.success.length > 0 && (
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-700 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Successfully Uploaded ({uploadResult.success.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {uploadResult.success.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                      </div>
                      <Badge variant="outline" className="bg-white">Row {item.row}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error List */}
          {uploadResult.errors.length > 0 && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-700 flex items-center gap-2">
                  <XCircle className="h-5 w-5" />
                  Failed to Upload ({uploadResult.errors.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {uploadResult.errors.map((item, index) => (
                    <div key={index} className="p-3 bg-red-50 rounded border border-red-200">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium">{item.name}</p>
                        <Badge variant="destructive">Row {item.row}</Badge>
                      </div>
                      <ul className="list-disc list-inside space-y-1">
                        {item.errors.map((error, idx) => (
                          <li key={idx} className="text-sm text-red-700">{error}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-center">
            {uploadResult.success.length > 0 && (
              <Link href="/admin/products">
                <Button className="bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900">
                  View Products
                </Button>
              </Link>
            )}
            <Button onClick={clearData} variant="outline">
              Upload Another File
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
