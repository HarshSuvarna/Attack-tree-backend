import {
  Controller,
  Get,
  InternalServerErrorException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/authentication/auth.guard';

@ApiTags('storage')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT')
@Controller('storage')
@Controller('storage')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Get('/get-signed-url')
  getSignedUrl(@Query() param: any) {
    try {
      return this.firebaseService.generateSignedUrl(
        `${param.nodeId}/${param.filename}`,
      );
    } catch (error) {
      console.log(`API Error: get-singed-url/get -`, error?.message || error);
      throw new InternalServerErrorException(error?.message || error);
    }
  }

  @Get('/get-download-url')
  getDownloadUrl(@Query() param) {
    try {
      return this.firebaseService.generateSignedUrlforDownload(
        `${param.nodeId}/${param.filename}`,
      );
    } catch (error) {
      console.log(`API Error: get-download-url/get -`, error?.message || error);
      throw new InternalServerErrorException(error?.message || error);
    }
  }
}
