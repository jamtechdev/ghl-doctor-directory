'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import Link from 'next/link';
import { Doctor } from '@/types/doctor';

type FormStep = 'basic' | 'professional' | 'location' | 'contact' | 'additional' | 'credentials';

export default function EditDoctorPage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [currentStep, setCurrentStep] = useState<FormStep>('basic');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    specialties: [] as string[],
    city: '',
    state: '',
    address: '',
    zipCode: '',
    conditions: [] as string[],
    bio: '',
    brandColor: '#3B82F6',
    phone: '',
    email: '',
    website: '',
    education: [] as Array<{ degree: string; institution: string; year?: number }>,
    certifications: [] as Array<{ name: string; issuingOrganization: string; year?: number }>,
  });
  const [newCondition, setNewCondition] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('');

  const steps: { id: FormStep; label: string; icon: React.ReactElement }[] = [
    {
      id: 'basic',
      label: 'Basic Info',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
    },
    {
      id: 'professional',
      label: 'Professional',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
    },
    {
      id: 'location',
      label: 'Location',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    },
    {
      id: 'contact',
      label: 'Contact',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
    },
    {
      id: 'additional',
      label: 'Additional',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
    },
    {
      id: 'credentials',
      label: 'Credentials',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
    },
  ];

  const getCurrentStepIndex = () => steps.findIndex(s => s.id === currentStep);
  const canGoNext = () => {
    const step = currentStep;
    if (step === 'basic') return formData.name;
    if (step === 'professional') return formData.specialty;
    if (step === 'location') return formData.city && formData.state;
    if (step === 'contact') return true;
    if (step === 'additional') return formData.bio;
    if (step === 'credentials') return true;
    return false;
  };

  const nextStep = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
      setError('');
    }
  };

  const prevStep = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
      setError('');
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && token && params.id) {
      fetchDoctor();
    }
  }, [user, token, params.id]);

  const fetchDoctor = async () => {
    try {
      const response = await fetch(`/api/doctors/${params.id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        const doc = data.doctor;
        setDoctor(doc);
        const additionalSpecialties = doc.specialties?.filter((s: string) => s !== doc.specialty) || [];
        setFormData({
          name: doc.name || '',
          specialty: doc.specialty || '',
          specialties: additionalSpecialties,
          city: doc.location?.city || '',
          state: doc.location?.state || '',
          address: doc.location?.address || '',
          zipCode: doc.location?.zipCode || '',
          conditions: doc.conditions || [],
          bio: doc.bio || '',
          brandColor: doc.brandColor || '#3B82F6',
          phone: doc.contact?.phone || '',
          email: doc.contact?.email || '',
          website: doc.contact?.website || '',
          education: doc.education || [],
          certifications: doc.certifications || [],
        });
        if (doc.image) {
          setImagePreview(doc.image);
        }
      } else {
        setError('Doctor not found');
      }
    } catch (error) {
      setError('Failed to load doctor');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a JPEG, PNG, or WebP image.');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds 5MB limit.`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);
      const img = new Image();
      img.onload = () => {
        if (img.width < 50 || img.height < 50) {
          setError('Image dimensions are too small. Please use an image at least 50x50 pixels.');
          setImagePreview(null);
        }
      };
      img.onerror = () => {
        setError('Invalid image file. Please check the file and try again.');
        setImagePreview(null);
      };
      img.src = result;
    };
    reader.onerror = () => {
      setError('Failed to read image file. Please try again.');
      setImagePreview(null);
    };
    reader.readAsDataURL(file);

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }
      if (!data.url) {
        throw new Error('Server did not return a valid image URL');
      }
      setUploadedImageUrl(data.url);
      setError('');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to upload image';
      setError(errorMessage);
      setImagePreview(null);
      setUploadedImageUrl('');
    } finally {
      setUploadingImage(false);
    }
  };

  const addCondition = () => {
    if (newCondition.trim() && !formData.conditions.includes(newCondition.trim())) {
      setFormData({ ...formData, conditions: [...formData.conditions, newCondition.trim()] });
      setNewCondition('');
    }
  };

  const removeCondition = (index: number) => {
    setFormData({ ...formData, conditions: formData.conditions.filter((_, i) => i !== index) });
  };

  const addSpecialty = () => {
    if (newSpecialty.trim() && !formData.specialties.includes(newSpecialty.trim())) {
      setFormData({ ...formData, specialties: [...formData.specialties, newSpecialty.trim()] });
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (index: number) => {
    setFormData({ ...formData, specialties: formData.specialties.filter((_, i) => i !== index) });
  };

  const addEducation = () => {
    setFormData({ ...formData, education: [...formData.education, { degree: '', institution: '', year: undefined }] });
  };

  const updateEducation = (index: number, field: 'degree' | 'institution' | 'year', value: string | number | undefined) => {
    const updated = [...formData.education];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, education: updated });
  };

  const removeEducation = (index: number) => {
    setFormData({ ...formData, education: formData.education.filter((_, i) => i !== index) });
  };

  const addCertification = () => {
    setFormData({ ...formData, certifications: [...formData.certifications, { name: '', issuingOrganization: '', year: undefined }] });
  };

  const updateCertification = (index: number, field: 'name' | 'issuingOrganization' | 'year', value: string | number | undefined) => {
    const updated = [...formData.certifications];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, certifications: updated });
  };

  const removeCertification = (index: number) => {
    setFormData({ ...formData, certifications: formData.certifications.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (!formData.name || !formData.specialty || !formData.city || !formData.state || !formData.bio) {
      setError('Please complete all required fields');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`/api/doctors/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          specialty: formData.specialty,
          specialties: formData.specialties.length > 0
            ? [formData.specialty, ...formData.specialties.filter((s: string) => s !== formData.specialty)]
            : [formData.specialty],
          location: {
            city: formData.city,
            state: formData.state,
            address: formData.address || undefined,
            zipCode: formData.zipCode || undefined,
          },
          conditions: formData.conditions.filter(c => c.trim()),
          bio: formData.bio,
          brandColor: formData.brandColor,
          image: uploadedImageUrl || doctor?.image || undefined,
          contact: {
            phone: formData.phone || undefined,
            email: formData.email || undefined,
            website: formData.website || undefined,
          },
          education: formData.education.filter(e => e.degree.trim() || e.institution.trim()),
          certifications: formData.certifications.filter(c => c.name.trim() || c.issuingOrganization.trim()),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update doctor');
      }
      router.push('/dashboard/doctors');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'basic':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Image</h3>
              <div className="space-y-4">
                {(imagePreview || uploadedImageUrl || doctor?.image) && (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200 shadow-sm">
                    <img src={imagePreview || uploadedImageUrl || doctor?.image} alt="Preview" className="w-full h-full object-contain object-top" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {doctor?.image ? 'Upload New Image File (Optional)' : 'Upload Image File'}
                  </label>
                  <input 
                    type="file" 
                    accept="image/jpeg,image/jpg,image/png,image/webp" 
                    onChange={handleImageUpload} 
                    disabled={uploadingImage} 
                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors disabled:opacity-50 hover:border-gray-400 cursor-pointer" 
                  />
                  {uploadingImage && (
                    <p className="mt-2 text-sm text-blue-600 flex items-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Uploading...
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    Max size: 5MB. Formats: JPEG, PNG, WebP. Minimum dimensions: 50x50 pixels.
                  </p>
                  {doctor?.image && !uploadedImageUrl && (
                    <p className="mt-2 text-xs text-blue-600">
                      Current image will be kept if no new file is uploaded.
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Doctor Name *</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Dr. John Smith" required />
            </div>
          </div>
        );

      case 'professional':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Specialty *</label>
              <input type="text" value={formData.specialty} onChange={(e) => setFormData({ ...formData, specialty: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="e.g., Orthopedic Surgery" required />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Additional Specialties</label>
                <button type="button" onClick={addSpecialty} className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>Add
                </button>
              </div>
              <div className="flex gap-2 mb-3">
                <input type="text" value={newSpecialty} onChange={(e) => setNewSpecialty(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSpecialty(); } }} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter specialty" />
                <button type="button" onClick={addSpecialty} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add</button>
              </div>
              {formData.specialties.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.specialties.map((specialty, index) => (
                    <span key={index} className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm border border-purple-200">
                      {specialty}
                      <button type="button" onClick={() => removeSpecialty(index)} className="text-purple-600 hover:text-purple-800">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Conditions & Keywords</label>
              <div className="flex gap-2 mb-3">
                <input type="text" value={newCondition} onChange={(e) => setNewCondition(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCondition(); } }} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter condition" />
                <button type="button" onClick={addCondition} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add</button>
              </div>
              {formData.conditions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.conditions.map((condition, index) => (
                    <span key={index} className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-200">
                      {condition}
                      <button type="button" onClick={() => removeCondition(index)} className="text-blue-600 hover:text-blue-800">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'location':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Enter city" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                <input type="text" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Enter state" required />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Street address" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                <input type="text" value={formData.zipCode} onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="12345" />
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="(555) 123-4567" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="doctor@example.com" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input type="url" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="https://www.example.com" />
              </div>
            </div>
          </div>
        );

      case 'additional':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Biography *</label>
              <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none" rows={8} placeholder="Enter doctor's biography and professional background..." required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand Color</label>
              <div className="flex items-center gap-3">
                <input type="color" value={formData.brandColor} onChange={(e) => setFormData({ ...formData, brandColor: e.target.value })} className="w-16 h-12 border border-gray-300 rounded-lg cursor-pointer" />
                <input type="text" value={formData.brandColor} onChange={(e) => setFormData({ ...formData, brandColor: e.target.value })} className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="#3B82F6" />
              </div>
            </div>
          </div>
        );

      case 'credentials':
        return (
          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Education</h3>
                <button type="button" onClick={addEducation} className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>Add Education
                </button>
              </div>
              <div className="space-y-4">
                {formData.education.map((edu, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Degree</label>
                        <input type="text" value={edu.degree} onChange={(e) => updateEducation(index, 'degree', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="MD, BS, etc." />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Institution</label>
                        <input type="text" value={edu.institution} onChange={(e) => updateEducation(index, 'institution', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="University Name" />
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-700 mb-1">Year</label>
                          <input type="number" value={edu.year || ''} onChange={(e) => updateEducation(index, 'year', e.target.value ? parseInt(e.target.value) : undefined)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="2005" />
                        </div>
                        <button type="button" onClick={() => removeEducation(index)} className="mt-6 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {formData.education.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No education entries. Click "Add Education" to add one.</p>}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Certifications</h3>
                <button type="button" onClick={addCertification} className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>Add Certification
                </button>
              </div>
              <div className="space-y-4">
                {formData.certifications.map((cert, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Certification Name</label>
                        <input type="text" value={cert.name} onChange={(e) => updateCertification(index, 'name', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Board Certified" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Issuing Organization</label>
                        <input type="text" value={cert.issuingOrganization} onChange={(e) => updateCertification(index, 'issuingOrganization', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Organization Name" />
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-700 mb-1">Year</label>
                          <input type="number" value={cert.year || ''} onChange={(e) => updateCertification(index, 'year', e.target.value ? parseInt(e.target.value) : undefined)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="2010" />
                        </div>
                        <button type="button" onClick={() => removeCertification(index)} className="mt-6 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {formData.certifications.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No certification entries. Click "Add Certification" to add one.</p>}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (authLoading || loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AppLayout>
    );
  }

  if (!user || !doctor) {
    return null;
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Doctor</h1>
              <p className="text-gray-600 mt-1">Update doctor profile information</p>
            </div>
            <Link href="/dashboard/doctors" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              Cancel
            </Link>
          </div>

          {/* Progress Steps */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const isActive = step.id === currentStep;
                const isCompleted = getCurrentStepIndex() > index;
                return (
                  <div key={step.id} className="flex items-center flex-1">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(step.id)}
                      className={`flex items-center gap-3 flex-1 ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'} transition-colors`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${isActive ? 'border-blue-600 bg-blue-50' : isCompleted ? 'border-green-600 bg-green-50' : 'border-gray-300 bg-white'}`}>
                        {isCompleted ? (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        ) : (
                          step.icon
                        )}
                      </div>
                      <span className={`font-medium hidden md:block ${isActive ? 'text-blue-600' : ''}`}>{step.label}</span>
                    </button>
                    {index < steps.length - 1 && (
                      <div className={`h-0.5 flex-1 mx-2 ${isCompleted ? 'bg-green-600' : 'bg-gray-300'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 md:p-8">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              {renderStepContent()}
            </div>

            {/* Footer Actions */}
            <div className="px-6 md:px-8 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Step {getCurrentStepIndex() + 1} of {steps.length}
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                {getCurrentStepIndex() > 0 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Previous
                  </button>
                )}
                {getCurrentStepIndex() < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!canGoNext()}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    Next Step
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting || !canGoNext()}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {submitting ? 'Updating...' : 'Update Doctor'}
                    {!submitting && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
