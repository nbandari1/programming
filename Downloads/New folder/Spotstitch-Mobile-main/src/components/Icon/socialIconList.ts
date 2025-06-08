type SocialMediaIcon = {
  id: number;
  name: "facebook" | "twitter" | "instagram" | "google";
  onPress: () => void;
};

export const socialIconList: SocialMediaIcon[] = [
  {
    id: 1,
    name: "facebook",
    onPress: () => {
      console.log("facebook");
    }
  },
  {
    id: 2,
    name: "twitter",
    onPress: () => {
      console.log("twitter");
    }
  },
  {
    id: 3,
    name: "instagram",
    onPress: () => {
      console.log("instagram");
    }
  },
  {
    id: 4,
    name: "google",
    onPress: () => {
      console.log("google");
    }
  }
];
