import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { AppRepository } from './app.repository';
import { CreateUserDto } from './dtos/create.user.dto';
import { LoginUserDto } from './dtos/login.user.dto';
import { MessageForSendEmail } from './dtos/send.email.dto';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly client: ClientKafka,
    private readonly appRepository: AppRepository,
  ) {}

  private readonly uuid = uuidv4();

  async onModuleInit() {
    await this.client.connect();
  }

  async createUser(createUserDto: CreateUserDto) {
    const emailExists = await this.appRepository.findUserByEmail(
      createUserDto.email,
    );
    if (emailExists) throw new ConflictException();
    createUserDto.password = bcrypt.hashSync(createUserDto.password, 10);
    const newUser = await this.appRepository.createUser(createUserDto);
    const hash: string = this.uuid;
    await this.appRepository.createVerification(newUser.id, hash);
    const messageForVerification: MessageForSendEmail = {
      typeService: 'EMAIL',
      recipient: newUser.email,
      name: newUser.name,
      typeMessage: 'NEW_USER',
      additionalInformation: hash,
    };
    this.client.emit('notify', messageForVerification);
    return newUser;
  }

  async loginUser({ email, password }: LoginUserDto) {
    const user = await this.appRepository.findUserByEmail(email);
    if (!user) throw new NotFoundException();
    const resultHash = bcrypt.compareSync(password, user.password);
    if (!resultHash) throw new ConflictException();
    if (!user.validated_email) throw new UnauthorizedException();
    const token = this.generateToken(user.id);
    await this.appRepository.createSession(token, user.id);
    return token;
  }

  private generateToken(user_id: number) {
    const token = jwt.sign({ user_id }, process.env.SECRET_JWT);
    return token;
  }

  async validationNewUser(message: string) {
    const validation = await this.appRepository.findValidation(message);
    if (!validation || validation.verificated) throw new NotFoundException();
    await this.appRepository.validate(validation.user_id);
    await this.appRepository.validateEmailUser(validation.user_id);
    const token = this.generateToken(validation.user_id);
    await this.appRepository.createSession(token, validation.user_id);
    return token;
  }
}
