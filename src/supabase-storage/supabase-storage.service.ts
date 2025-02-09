import * as bcrypt from 'bcrypt';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SUPABASECLIENT } from '../supabase/supabase.module';
import { SupabaseClient } from '@supabase/supabase-js';
import { MAX_FILE_NAME_LENGTH, MaxAvatarFileSize } from '../constants';
import {
  ApiDeleteAvatarFileException,
  ApiFailedToGetAvatarPublicUrlException,
  ApiListAvatarFileException,
  ApiUploadAvatarFileException,
  MaxAvatarFileSizeException,
  TypeMimeTypeInvalidException,
} from '../exceptions';
import { isMimeFileTypeIn, multerToFile } from '../utils';
import { MimeType, ValidAvatarMimeTypes } from '../types';
import { SupabaseBucketEnum } from '../enums';

@Injectable()
export class SupabaseStorageService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(SUPABASECLIENT) private readonly supabaseClient: SupabaseClient,
  ) {}

  async uploadAvatarFile(
    userName: string,
    uploadedFile: Express.Multer.File,
  ): Promise<string> {
    try {
      if (uploadedFile.size > MaxAvatarFileSize) {
        throw MaxAvatarFileSizeException;
      }
      if (
        isMimeFileTypeIn(
          uploadedFile.mimetype as MimeType,
          ValidAvatarMimeTypes as MimeType[],
        )
      ) {
        throw TypeMimeTypeInvalidException(
          uploadedFile.mimetype as MimeType,
          ValidAvatarMimeTypes as MimeType[],
        );
      }

      const convertedFile = multerToFile(uploadedFile);
      const hashedFileName = await bcrypt.hash(
        userName,
        Number(
          this.configService.get<number>('AVATAR_FILE_NAME_SALT_OR_ROUND'),
        ),
      );
      const targetFolderPath = `${userName}/`;
      const targetFilePath = `${targetFolderPath}${hashedFileName.replaceAll(' ', '').replaceAll('.', '').replaceAll('/', '_').substring(0, MAX_FILE_NAME_LENGTH)}`;

      const { data: existingFiles, error: listError } =
        await this.supabaseClient.storage
          .from(SupabaseBucketEnum.AvatarBucket)
          .list(targetFolderPath);
      if (listError) {
        throw ApiListAvatarFileException;
      }

      if (existingFiles && existingFiles.length > 0) {
        const filesToDelete = existingFiles.map(
          (file) => `${targetFolderPath}${file.name}`,
        );
        const { error: deleteError } = await this.supabaseClient.storage
          .from(SupabaseBucketEnum.AvatarBucket)
          .remove(filesToDelete);
        if (deleteError) {
          throw ApiDeleteAvatarFileException;
        }
      }

      const { error: uploadError } = await this.supabaseClient.storage
        .from(SupabaseBucketEnum.AvatarBucket)
        .upload(targetFilePath, convertedFile);
      if (uploadError) {
        throw ApiUploadAvatarFileException;
      }

      const { data: publicUrlData } = this.supabaseClient.storage
        .from(SupabaseBucketEnum.AvatarBucket)
        .getPublicUrl(targetFilePath);
      if (!publicUrlData || !publicUrlData.publicUrl) {
        throw ApiFailedToGetAvatarPublicUrlException;
      }

      return publicUrlData.publicUrl;
    } catch (error) {
      throw error;
    }
  }
}
