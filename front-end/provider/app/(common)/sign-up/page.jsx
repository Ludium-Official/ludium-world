import SignUp from "./SignUp";

export const metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_MAP_URL,
  title: "회원가입",
  description: "루디움 회원이되어 WEB 3.0 활동을 시작해보세요",
  openGraph: {
    title: "회원가입",
    description: "루디움 회원이되어 WEB 3.0 활동을 시작해보세요",
    url: process.env.NEXT_PUBLIC_SITE_MAP_URL,
    siteName: "루디움",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "logo1.png",
        width: 70,
        height: 32,
        alt: "루디움",
      },
    ],
  },
};

export default function SignUpPage() {
  return (
    <div className="frame-93">
      <SignUp />
    </div>
  );
}
