// The type is used by the global typescript ls. We are not exporting it
// as it turns this file into a module, which is not what we want.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type RootStackParamList = {
  EventScreen: {
    name: string;
    time: string;
    area: string;
    imageUrl: string;
    description: string;
  };
  TrendingScreen: {
    posts: {
      id: number;
      username: string;
      text: string;
      type: string;
      image: string;
    }[];
  };
  PostScreen: {
    username: string;
    text: string;
    image?: string;
    profilePic?: string;
    reactions: string[];
    timeAgo: string;
  };
  StartScreen: undefined;
  LoginOTPVerificationScreen: undefined;
  RegisterScreen: undefined;
  LoginScreen: undefined;
  Dashboard: undefined;
  LoadingScreen: undefined;
  ResetPasswordScreen: undefined;
  AccountCreationScreen: undefined;
  CreatePostScreen: undefined;
};

declare module "*.png" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const value: any;
  export default value;
}
declare module "*.jpg" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const value: any;
  export default value;
}
