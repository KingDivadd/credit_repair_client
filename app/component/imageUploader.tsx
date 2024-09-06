'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { ImageUploaderProps, ProjectImageUploaderProps } from '@/types';

export const TaskFilesUploadTwo = ({ id, title, url, image, onFileUpload }: ImageUploaderProps) => {
    const [filePreview, setFilePreview] = useState('');
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (url) {
            setFilePreview(url);
        }
    }, [url]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const previewUrl = URL.createObjectURL(selectedFile);
            setFilePreview(previewUrl);

            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('upload_preset', 'crm_images');

            try {
                const response = await axios.post('https://api.cloudinary.com/v1_1/iroegbu-cloud-1/upload', formData);
                const uploadedFileUrl = response.data.secure_url;
                console.log('Uploaded File URL:', uploadedFileUrl);

                // Invoke the callback to send the URL back to the parent component
                if (onFileUpload) {
                    onFileUpload(uploadedFileUrl);
                }
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        } else {
            setFilePreview('');
            setFile(null);
            alert('Please select a valid file.');
        }
    };

    const renderPreview = () => {
        if (!filePreview) return null; // Return null if there's no file preview
        
        const fileType = file?.type;
    
        if (fileType?.startsWith('image/')) {
            return (
                <span className="relative w-full h-[160px] rounded-[3px] overflow-hidden">
                    <Image
                        src={filePreview}
                        alt="File Preview"
                        layout="fill"
                        objectFit="cover"
                    />
                </span>
            );
        } else if (fileType === 'application/pdf') {
            return (
                <iframe
                    src={filePreview}
                    title="PDF Preview"
                    className="w-full h-[160px] rounded-[3px]"
                />
            );
        } else if (fileType === 'application/acad' || fileType === 'application/dwg') {
            return (
                <div className="w-full h-full flex justify-center items-center h-[160px] rounded-[3px] ">
                    <p className="text-gray-500">DWG File Uploaded</p>
                </div>
            );
        } else {
            return (
                <div className="w-full h-full flex justify-center items-center h-[160px] rounded-[3px] ">
                    <p className="text-gray-500">File Uploaded</p>
                </div>
            );
        }
    };
    

    return (
        <div className="w-full flex flex-col justify-start items-start gap-2 h-full">
            <span className="w-full flex flex-col items-start justify-start gap-2">
                <h4 className="text-sm font-light">{title}</h4>
                <input 
                    type="file" 
                    name={`file-${id}`} 
                    accept="image/*,application/pdf,application/acad,application/dwg" 
                    onChange={handleFileChange}
                    id={`fileInput-${id}`}
                    style={{ display: 'none' }}
                />
                <button 
                    type="button" 
                    className="w-full h-[40px] rounded-[3px] text-sm flex items-center justify-center bg-slate-700 text-white hover:bg-slate-800" 
                    onClick={() => document.getElementById(`fileInput-${id}`)?.click()}
                >
                    Select File
                </button>
            </span>
            {filePreview && renderPreview()}
        </div>
    );
};