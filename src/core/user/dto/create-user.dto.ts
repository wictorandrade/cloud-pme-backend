export class CreateUserDto {
  // Essa classe não usa validações do ClassValidator por que validar isso é
  // responsabilidade de outros modulos por meio do userService
  displayName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string | null;
  avatarUrl: string | null;
  googleId: string;
}
