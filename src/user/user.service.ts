import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 회원 등록하는 로직
  async createUser(createUserDto: CreateUserDto) {
    const newUser = await this.userRepository.create(createUserDto);
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

  async getUserBy(key: 'id' | 'email', value: string) {
    const user = await this.userRepository.findOneBy({ [key]: value });
    if (user) return user;
    throw new NotFoundException(`User with this ${key} does not exist`);
  }
}
