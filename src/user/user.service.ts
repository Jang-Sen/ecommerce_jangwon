import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { User } from '@user/entities/user.entity';
import { Provider } from '@user/entities/provider.enum';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/common/cache';
import { Cache } from 'cache-manager';
import { PageOptionsDto } from '@root/common/dto/page-options.dto';
import { PageDto } from '@root/common/dto/page.dto';
import { PageMetaDto } from '@root/common/dto/page-meta.dto';
import { MinioClientService } from '@minio-client/minio-client.service';
import { BufferedFile } from '@minio-client/interface/file.model';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly minioClientService: MinioClientService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // 회원 등록하는 로직
  async createUser(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto);
    await this.userRepository.save(newUser);

    return newUser;
  }

  // // 특정 id를 기반으로 유저 정보 가져오기
  // async getUserById(id: string) {
  //   const getId = await this.userRepository.findOneBy({ id });
  //
  //   if (!getId) {
  //     throw new NotFoundException('User Not Found');
  //   }
  //
  //   return getId;
  // }
  //
  // // 특정 email 가져오기
  // async getEmail(email: string) {
  //   const user = await this.userRepository.findOneBy({ email });
  //
  //   if (!user) {
  //     throw new NotFoundException('User Not Found');
  //   }
  //
  //   return user;
  // }

  // 전체 유저정보 가져오기
  async getUserByAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<User>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (pageOptionsDto.keyword) {
      queryBuilder.andWhere('user.username LIKE :keyword', {
        keyword: `%${pageOptionsDto.keyword}%`,
      });
    }

    queryBuilder
      .leftJoinAndSelect('user.agreeOfTerm', 'agreeOfTerm')
      .orderBy('user.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });

    return new PageDto(entities, pageMetaDto);
    // return await this.userRepository.find();
  }

  // 특정 id or email 기반 유저 정보 가져오기
  async getUserBy(key: 'id' | 'email', value: string) {
    const user = await this.userRepository.findOneBy({ [key]: value });
    if (user) return user;
    throw new NotFoundException(`User with this ${key} does not exist`);
  }

  // 비밀번호 변경 로직
  async changePasswordWithToken(token: string, newPassword: string) {
    const { email } = await this.jwtService.verify(token, {
      secret: this.configService.get('FIND_PASSWORD_TOKEN_SECRET'),
    });

    // 유저 찾기
    const user = await this.getUserBy('email', email);
    if (user.provider !== Provider.LOCAL) {
      throw new HttpException(
        `You can't change the password for the part you registered as a social login`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // 패스워드 암호화
    const genSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, genSalt);

    const result = await this.userRepository.update(user.id, {
      password: hashedPassword,
    });

    if (!result.affected) {
      throw new BadRequestException('Bad Request');
    }

    return 'updated password';
  }

  // save refreshToken to Redis
  async setCurrentRefreshTokenToRedis(refreshToken: string, userId: string) {
    const saltValue = await bcrypt.genSalt(10);
    const currentHashedRefreshToken = await bcrypt.hash(
      refreshToken,
      saltValue,
    );

    await this.cacheManager.set(userId, currentHashedRefreshToken);
  }

  // refreshToken 검증 로직
  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.getUserBy('id', userId);
    const getUserIdFromRedis = await this.cacheManager.get(user.id);
    console.log(getUserIdFromRedis);
    const isRefreshTokenMatched = await bcrypt.compare(
      refreshToken,
      getUserIdFromRedis,
    );
    console.log(user);

    if (isRefreshTokenMatched) {
      return user;
    }
    return '--------------';
  }

  // 유저의 토큰을 이용해 프로필 사진 수정 로직
  async updateUserInfoByToken(
    user: User,
    img?: BufferedFile,
    updateUserDto?: CreateUserDto,
  ): Promise<string> {
    const profileImg = await this.minioClientService.uploadProfileImg(
      user,
      img,
      'profile',
    );

    const response = await this.userRepository.update(user.id, {
      ...updateUserDto,
      profileImg,
    });

    if (!response.affected) {
      throw new HttpException('Not Found User', HttpStatus.NO_CONTENT);
    }

    return 'success';
  }
}
