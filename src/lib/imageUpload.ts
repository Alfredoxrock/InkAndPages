import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * Upload an image to Firebase Storage
 * @param file - The image file to upload
 * @param path - Optional path in storage (defaults to 'blog-images/')
 * @returns Promise<string> - The download URL of the uploaded image
 */
export async function uploadImage(file: File, path: string = 'blog-images/'): Promise<string> {
    try {
        // Create a unique filename
        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const fullPath = `${path}${fileName}`;

        // Create a reference to the storage location
        const storageRef = ref(storage, fullPath);

        // Upload the file
        const snapshot = await uploadBytes(storageRef, file);

        // Get the download URL
        const downloadURL = await getDownloadURL(snapshot.ref);

        return downloadURL;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Failed to upload image');
    }
}

/**
 * Validate if a file is an image
 * @param file - The file to validate
 * @returns boolean - True if the file is an image
 */
export function isValidImage(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
        throw new Error('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
    }

    if (file.size > maxSize) {
        throw new Error('Image size must be less than 5MB');
    }

    return true;
}