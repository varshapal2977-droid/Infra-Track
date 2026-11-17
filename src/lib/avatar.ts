import { supabase } from "@/integrations/supabase/client";

export const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
export const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export interface AvatarValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates file type and size according to InfraTrack requirements.
 */
export function validateAvatarFile(file: File): AvatarValidationResult {
  if (!file) {
    return { valid: false, error: "No file was selected." };
  }

  // File type check
  const isTypeAllowed =
    ALLOWED_AVATAR_TYPES.includes(file.type.toLowerCase()) ||
    /\.(jpe?g|png|webp)$/i.test(file.name);

  if (!isTypeAllowed) {
    return {
      valid: false,
      error: "Unsupported file format. Please upload a JPG, JPEG, PNG, or WEBP image.",
    };
  }

  // File size check (5MB limit)
  if (file.size > MAX_AVATAR_SIZE_BYTES) {
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File is too large (${sizeInMb} MB). Maximum allowed size is 5 MB.`,
    };
  }

  return { valid: true };
}

/**
 * Resizes and crops an image to a centered square on an HTML5 Canvas,
 * returning a lightweight, high-resolution data URL and binary Blob.
 */
export async function createOptimizedAvatar(
  file: File,
  maxDimension = 400,
  quality = 0.9,
): Promise<{ dataUrl: string; blob: Blob }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Failed to read the selected image file."));

    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Failed to process the image data."));

      img.onload = () => {
        // Calculate center square crop
        const minSide = Math.min(img.width, img.height);
        const startX = (img.width - minSide) / 2;
        const startY = (img.height - minSide) / 2;

        const canvas = document.createElement("canvas");
        const targetSize = Math.min(minSide, maxDimension);
        canvas.width = targetSize;
        canvas.height = targetSize;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not initialize canvas context."));
          return;
        }

        // Draw center-cropped square
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(
          img,
          startX,
          startY,
          minSide,
          minSide,
          0,
          0,
          targetSize,
          targetSize,
        );

        const dataUrl = canvas.toDataURL("image/jpeg", quality);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({ dataUrl, blob });
            } else {
              // Fallback blob from base64 if toBlob fails
              const byteString = atob(dataUrl.split(",")[1]);
              const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
              const ab = new ArrayBuffer(byteString.length);
              const ia = new Uint8Array(ab);
              for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
              }
              resolve({ dataUrl, blob: new Blob([ab], { type: mimeString }) });
            }
          },
          "image/jpeg",
          quality,
        );
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Attempts to upload the avatar blob to Supabase Storage.
 * Returns publicUrl if successful, or null if storage bucket is not configured.
 */
export async function uploadAvatarToStorage(
  userId: string,
  blob: Blob,
): Promise<string | null> {
  try {
    const filePath = `${userId}/avatar-${Date.now()}.jpg`;

    // Attempt upload to 'avatars' storage bucket
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(filePath, blob, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (!error && data) {
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);
      return publicUrl;
    }
  } catch (err) {
    console.warn("Storage upload note (falling back to secure data URL storage):", err);
  }

  return null;
}
