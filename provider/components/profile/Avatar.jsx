import dynamic from "next/dynamic";
import Icon from "../Icon";
import Link from "next/link";
import NearWallet from "../blockchain/wallet/NearWallet";

const Viewer = dynamic(() => import("@/components/Viewer"), { ssr: false });

export default function Avatar({ profile }) {
  return (
    <div className="frame-81">
      <div className="frame-82">
        <div className="frame-83">
          <div className="frame-84">
            <div className="group-8">
              <Icon
                className="avatar"
                src={profile.avatar}
                alt="아바타"
                width={60}
                height={60}
              />
            </div>
            <p className="avatar-greeting">
              안녕하세요, <span className="avatar-nick">{profile.nick}</span>님
            </p>
          </div>
          <div className="frame-80">
            <div className="p1-18 color-gray-03">
              <Viewer content={profile.selfIntro.split("\n")[0]} />
            </div>
            <div className="frame-79">
              <div className="icon-28">
                <Icon
                  className="tel"
                  src="/icon_tel.svg"
                  alt="tel"
                  width={18}
                  height={18}
                />
              </div>
              <p className="p1-18 color-gray-03">{profile.phnNmb}</p>
            </div>
          </div>
        </div>
        <Link className="link button-M-a" href="/profile/edit">
          <Icon
            src="/icon_cog_wheel.svg"
            alt="cog wheel"
            width={18}
            height={18}
          />
          <p className="p5-18 color-white">프로필 수정</p>
        </Link>
        <NearWallet />
      </div>
    </div>
  );
}
