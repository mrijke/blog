type PhotoType = "selfie" | "landscape" | "macro";

export interface IPhoto {
  title: string;
  description?: string;
  photo_type: PhotoType;
}

export interface ICreatePhotoPayload extends IPhoto {
  fileobject: File;
}
