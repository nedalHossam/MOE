import { useState, useCallback } from "react";
import { toast } from "react-toastify";

export const useFileUpload = () => {
    const [isUploading, setIsUploading] = useState(false);

    const handleFileUpload = useCallback(async (file, type) => {
        try {
            setIsUploading(true);

            // First, try to upload to a specific folder
            const formData = new FormData();

            // Generate a unique filename by adding timestamp
            const timestamp = new Date().getTime();
            const fileExtension = file.name.split(".").pop();
            const uniqueFileName = `${file.name.split(".")[0]}_${timestamp}.${fileExtension}`;

            formData.append("file", file);
            formData.append("title", uniqueFileName);
            formData.append("description", type === "attachment" ? "Driver Attachment" : "Driver Document");

            // Try uploading to the default Documents and Media folder
            let uploadResponse = await fetch(`/o/headless-delivery/v1.0/sites/${Liferay.ThemeDisplay.getSiteGroupId()}/documents`, {
                method: "POST",
                headers: {
                    "x-csrf-token": Liferay.authToken,
                    Accept: "application/json",
                },
                body: formData,
            });

            // If 403, try alternative endpoint
            if (uploadResponse.status === 403) {
                uploadResponse = await fetch(`/o/headless-delivery/v1.0/sites/${Liferay.ThemeDisplay.getSiteGroupId()}/documents`, {
                    method: "POST",
                    headers: {
                        "x-csrf-token": Liferay.authToken,
                        Accept: "application/json",
                        Authorization: `Bearer ${Liferay.authToken}`,
                    },
                    body: formData,
                });
            }

            if (!uploadResponse.ok) {
                const errorData = await uploadResponse.json();

                // Check if the error is due to duplicate file
                if (uploadResponse.status === 409 || (errorData.status === "CONFLICT" && errorData.title?.includes("already exists"))) {
                    // Generate a new unique filename with random string
                    const randomString = Math.random().toString(36).substring(2, 8);
                    const newFileName = `${file.name.split(".")[0]}_${timestamp}_${randomString}.${fileExtension}`;

                    // Create a new File object with the renamed filename
                    const renamedFile = new File([file], newFileName, {
                        type: file.type,
                        lastModified: file.lastModified,
                    });

                    const retryFormData = new FormData();
                    retryFormData.append("file", renamedFile);
                    retryFormData.append("title", newFileName);
                    retryFormData.append("description", type === "coverMedia" ? "Benefit Cover Media" : "User Guide");

                    // Retry upload with new filename
                    const retryResponse = await fetch(`/o/headless-delivery/v1.0/sites/${Liferay.ThemeDisplay.getSiteGroupId()}/documents`, {
                        method: "POST",
                        headers: {
                            "x-csrf-token": Liferay.authToken,
                            Accept: "application/json",
                        },
                        body: retryFormData,
                    });

                    if (!retryResponse.ok) {
                        const retryError = await retryResponse.json();
                        throw new Error(retryError.title || "File upload failed after rename attempt");
                    }

                    const retryData = await retryResponse.json();
                    toast.success("File uploaded successfully");
                    return {
                        id: retryData.id,
                        name: retryData.title,
                        url: retryData.contentUrl,
                    };
                }

                // If it's not a duplicate file error, throw the original error
                throw new Error(errorData.title || "File upload failed");
            }

            const uploadData = await uploadResponse.json();
            toast.success("File uploaded successfully");
            return {
                id: uploadData.id,
                name: uploadData.title,
                url: uploadData.contentUrl,
            };
        } catch (error) {
            console.error("File upload error:", error);
            toast.error(error.message || "Failed to upload file");
            return null;
        } finally {
            setIsUploading(false);
        }
    }, []);

    return {
        isUploading,
        handleFileUpload,
    };
};
