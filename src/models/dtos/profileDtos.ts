export interface GetProfileResponseDto {
  userId: string;
  username: string;
  email: string;
  bio?: string;
  audioFiles: {
    id: string;
    songName: string;
    length: number;
  }[];
}
