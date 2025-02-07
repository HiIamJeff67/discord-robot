export type AvatarFileType = File & {
  webkitRelativePath?: string;
};

export function multerToFile(multerFile: Express.Multer.File): AvatarFileType {
  return new File([multerFile.buffer], multerFile.originalname, {
    type: multerFile.mimetype,
    lastModified: Date.now(),
  }) as AvatarFileType;
}
