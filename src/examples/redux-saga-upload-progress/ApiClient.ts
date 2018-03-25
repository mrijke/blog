import superagent from superagent;

interface IWithFilePayload {
  fileobject: File;
}

const requests = {
  uploadWithFile: (url: string, payload: IWithFilePayload) => {
    const req = superagent
      .post(`/api/v1/${url}`)
      .attach("fileobject", payload.fileobject);
    for (const key in payload) {
      const value = payload[key as keyof typeof payload];
      if (key !== "fileobject" && value !== undefined) {
        req.field(key, value);
      }
    }
    return req;
  },
};

export const ApiClient = {
  Photo: {
    create: (payload: ICreatePhotoPayload) =>
      requests.uploadWithFile("content/photos/", payload),
  },
};
