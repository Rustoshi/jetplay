'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  Tag, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  ArrowLeft,
  Trash2,
  AlertTriangle,
  DollarSign,
  FileText,
  FolderOpen,
  Image,
  Edit
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';

interface CategoryData {
  _id: string;
  name: string;
}

interface SubCategoryData {
  id: string;
  name: string;
  description: string;
  price: number;
  category: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface EditResponse {
  success: boolean;
  message: string;
  data?: {
    subcategory: SubCategoryData;
  };
  error?: string;
}

export default function EditSubCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const subcategoryId = params.id as string;

  const [subcategory, setSubCategory] = useState<SubCategoryData | null>(null);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<EditResponse | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (subcategoryId) {
      fetchSubCategory();
      fetchCategories();
    }
  }, [subcategoryId]);

  const fetchSubCategory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/sub-categories/${subcategoryId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch subcategory');
      }

      const subcategoryData = data.data.subcategory;
      setSubCategory(subcategoryData);
      setFormData({
        name: subcategoryData.name,
        description: subcategoryData.description,
        price: subcategoryData.price.toString(),
        category: subcategoryData.category._id
      });
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || 'Failed to load subcategory data',
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      const data = await response.json();

      if (response.ok) {
        setCategories(data.data.categories);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Subcategory name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Subcategory name must be at least 2 characters long';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.category) {
      newErrors.category = 'Parent category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric fields
    const numericValue = name === 'price' ? parseFloat(value) || 0 : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: numericValue
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setResult(null);

    try {
      const response = await fetch(`/api/admin/sub-categories/${subcategoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        // Update local subcategory data
        setSubCategory(data.data.subcategory);
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Network error. Please try again.',
        error: 'Network error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSubCategory = async () => {
    setDeleting(true);
    
    try {
      const response = await fetch(`/api/admin/sub-categories/${subcategoryId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to subcategories list after successful deletion
        router.push('/admin/subcategories');
      } else {
        setResult({
          success: false,
          message: data.error || 'Failed to delete subcategory',
          error: data.error
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Network error. Please try again.',
        error: 'Network error'
      });
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading subcategory data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!subcategory) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Subcategory Not Found</h2>
            <p className="text-gray-600 mb-4">The subcategory you're looking for doesn't exist.</p>
            <Link
              href="/admin/subcategories"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Subcategories
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Link
                  href="/admin/subcategories"
                  className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Edit Subcategory</h1>
                  <p className="mt-2 text-gray-600">
                    Update "{subcategory.name}" subcategory information
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Subcategory ID: {subcategory.id}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Result Display */}
        {result && (
          <div className={`rounded-lg p-6 mb-6 ${
            result.success 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {result.success ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-red-600" />
                )}
              </div>
              <div className="ml-3 flex-1">
                <h3 className={`text-lg font-medium ${
                  result.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {result.success ? 'Success!' : 'Error'}
                </h3>
                <p className={`mt-2 text-sm ${
                  result.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {result.message || result.error}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Subcategory Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center">
                <div className="mx-auto h-20 w-20 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                  <Tag className="h-10 w-10 text-yellow-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  {subcategory.name}
                </h3>
                <p className="text-gray-600">Subcategory</p>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 mt-2">
                  {subcategory.category.name}
                </span>
              </div>
              
              <div className="mt-6 border-t pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Price:</span>
                    <span className="text-sm font-medium text-green-600">
                      {formatCurrency(subcategory.price)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Created:</span>
                    <span className="text-sm text-gray-900">
                      {new Date(subcategory.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Updated:</span>
                    <span className="text-sm text-gray-900">
                      {new Date(subcategory.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-6">
                <Tag className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Subcategory Information</h2>
                  <p className="text-gray-600">Update subcategory details</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Subcategory Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter subcategory name"
                      disabled={saving}
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Parent Category *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FolderOpen className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.category ? 'border-red-300' : 'border-gray-300'
                        }`}
                        disabled={saving}
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.category && (
                      <p className="mt-2 text-sm text-red-600">{errors.category}</p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.description ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter subcategory description"
                      disabled={saving}
                    />
                  </div>
                  {errors.description && (
                    <p className="mt-2 text-sm text-red-600">{errors.description}</p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">
                    Provide a detailed description of this subcategory
                  </p>
                </div>

                {/* Price */}
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₦) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.price ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="0.00"
                      disabled={saving}
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-2 text-sm text-red-600">{errors.price}</p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">
                    Current price: {formatCurrency(subcategory?.price || 0)}
                  </p>
                </div>


                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Link
                    href="/admin/subcategories"
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="-ml-1 mr-3 h-5 w-5" />
                        Update Subcategory
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6 border border-red-200">
              <div className="flex items-center mb-6">
                <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
                <div>
                  <h2 className="text-xl font-semibold text-red-900">Danger Zone</h2>
                  <p className="text-red-700">Irreversible and destructive actions</p>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-red-900 mb-2">Delete Subcategory</h3>
                    <p className="text-sm text-red-700 mb-4">
                      Permanently delete this subcategory. This action cannot be undone.
                      All products associated with this subcategory may be affected.
                    </p>
                    <ul className="text-sm text-red-600 space-y-1 mb-4">
                      <li>• Subcategory will be permanently deleted</li>
                      <li>• Associated products may lose their subcategory</li>
                      <li>• Price: {formatCurrency(subcategory.price)} will be lost</li>
                      <li>• This action cannot be reversed</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="ml-4 inline-flex items-center px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    disabled={saving || deleting}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Subcategory
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Subcategory</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Are you sure you want to delete <strong>"{subcategory?.name}"</strong>? 
                    This action cannot be undone and will permanently remove:
                  </p>
                  <ul className="text-sm text-gray-600 text-left mb-6 bg-gray-50 p-3 rounded">
                    <li>• The subcategory and all its data</li>
                    <li>• Price: {subcategory && formatCurrency(subcategory.price)}</li>
                    <li>• Category: {subcategory?.category.name}</li>
                    <li>• All associated configurations</li>
                  </ul>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      disabled={deleting}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteSubCategory}
                      className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={deleting}
                    >
                      {deleting ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4 mr-2" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Subcategory
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
