export interface IUser {
  id: string;
  username: string;
  isPrivate: boolean;
  authId: string;
  files?: IAudioFile[];
}

export interface IUserAuth {
  id: string;
  email: string;
  password: string;
  user?: IUser;
}

export interface IAudioFile {
  id: string;
  filename: string;
  filePath: string;
  size: number;
  length: number;
  format: string;
  uploadedAt: Date;
  isPublic: boolean;
  userId: string;
  user?: IUser;
}
