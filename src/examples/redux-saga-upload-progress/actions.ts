import { actionCreatorFactory, Action as TSAction } from "typescript-fsa";
import { ICreatePhotoPayload, IPhoto } from "./Photo";

const factory = actionCreatorFactory("PHOTOS");

export const performCreatePhoto = factory<ICreatePhotoPayload>(
  "PERFORM_CREATE_PHOTO"
);
export const createPhoto = factory.async<ICreatePhotoPayload, IPhoto, Error>(
  "CREATE_PHOTO"
);
export type CreatePhotoAction = TSAction<ICreatePhotoPayload>;
