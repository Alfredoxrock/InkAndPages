/**
 * Image utility functions for compression and optimization
 */

export interface CompressImageOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    maxSizeKB?: number;
}

/**
 * Compress and optimize an image file
 */
export const compressImage = async (
    file: File,
    options: CompressImageOptions = {}
): Promise<string> => {
    const {
        maxWidth = 1200,
        maxHeight = 800,
        quality = 0.8,
        maxSizeKB = 500 // Target max 500KB for base64
    } = options;

    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            // Calculate new dimensions while maintaining aspect ratio
            let { width, height } = img;

            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }

            if (height > maxHeight) {
                width = (width * maxHeight) / height;
                height = maxHeight;
            }

            canvas.width = width;
            canvas.height = height;

            // Draw and compress
            ctx?.drawImage(img, 0, 0, width, height);

            // Start with the specified quality and reduce if needed
            let currentQuality = quality;
            let compressedDataUrl: string;

            const tryCompress = () => {
                compressedDataUrl = canvas.toDataURL('image/jpeg', currentQuality);

                // Calculate approximate size in KB (base64 is ~4/3 of binary size)
                const sizeKB = (compressedDataUrl.length * 3) / (4 * 1024);

                if (sizeKB > maxSizeKB && currentQuality > 0.1) {
                    // Reduce quality and try again
                    currentQuality -= 0.1;
                    tryCompress();
                } else {
                    resolve(compressedDataUrl);
                }
            };

            tryCompress();
        };

        img.onerror = () => {
            reject(new Error('Failed to load image for compression'));
        };

        // Create object URL for the image
        img.src = URL.createObjectURL(file);
    });
};

/**
 * Validate image file before processing
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
    // Check file type
    if (!file.type.startsWith('image/')) {
        return { valid: false, error: 'Please select an image file' };
    }

    // Check file size (before compression) - allow up to 10MB since we'll compress
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        return { valid: false, error: 'Image size should be less than 10MB' };
    }

    return { valid: true };
};

/**
 * Get estimated base64 size from file size
 */
export const getEstimatedBase64Size = (fileSizeBytes: number): number => {
    // Base64 encoding increases size by ~33%
    return Math.ceil(fileSizeBytes * 1.33);
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};