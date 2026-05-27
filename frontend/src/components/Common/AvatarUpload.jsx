import React, { useRef, useState } from 'react';
import { User, Loader2, Camera } from 'lucide-react';
import { uploadAvatar } from '@/services/uploadService';
import { toast } from '@/utils/toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const sizeMap = {
  md: { outer: 'h-20 w-20', icon: 'h-10 w-10', cam: 'h-4 w-4 p-1', ring: 'border-4' },
  lg: { outer: 'h-28 w-28', icon: 'h-14 w-14', cam: 'h-5 w-5 p-1.5', ring: 'border-4' },
};

const AvatarUpload = ({ avatarUrl, onUploaded, size = 'md' }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const s = sizeMap[size] ?? sizeMap.md;

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Chỉ chấp nhận file ảnh (jpg, png, gif)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ảnh tối đa 5MB');
      return;
    }
    try {
      setUploading(true);
      const url = await uploadAvatar(file);
      onUploaded(url);
      toast.success('Tải ảnh lên thành công');
    } catch {
      toast.error('Tải ảnh thất bại');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const fullUrl = avatarUrl ? `${API_URL}${avatarUrl}` : null;

  return (
    <div
      className="relative group cursor-pointer"
      onClick={() => !uploading && inputRef.current?.click()}
    >
      <div
        className={`${s.outer} ${s.ring} rounded-full border-gray-100 bg-gray-100 shadow-md flex items-center justify-center overflow-hidden dark:border-gray-800 dark:bg-gray-900`}
      >
        {uploading ? (
          <Loader2 className={`${s.icon} animate-spin text-blue-500`} />
        ) : fullUrl ? (
          <img src={fullUrl} alt="avatar" className="h-full w-full object-cover" />
        ) : (
          <User className={`${s.icon} text-gray-400`} />
        )}
      </div>
      {!uploading && (
        <div className="absolute bottom-0 right-0 rounded-full bg-blue-600 text-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className={s.cam} />
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default AvatarUpload;
