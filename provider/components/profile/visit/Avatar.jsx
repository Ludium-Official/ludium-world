import Icon from "@/components/Icon";
import dynamic from "next/dynamic";

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
              안녕하세요, <span className="avatar-nick">{profile.nick}</span>{" "}
              입니다.
            </p>
          </div>
          <div className="frame-80">
            <div className="p1-18 color-gray-03">
              <Viewer content={profile.selfIntro.split("\n")[0]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
