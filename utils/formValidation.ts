export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Accepts formats like (123) 456-7890, 123-456-7890, 1234567890
  const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return re.test(phone);
};

export const validateFile = (file: File): { valid: boolean; error?: string } => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
        return { valid: false, error: 'Invalid file type. Please upload JPG, PNG, GIF, or WebP.' };
    }

    if (file.size > maxSize) {
        return { valid: false, error: 'File size too large. Maximum size is 10MB.' };
    }

    return { valid: true };
};
