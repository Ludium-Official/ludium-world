import Icon from "../Icon";

export default function Avatart({ profile }) {
  return (
    <article className="user-wrapper">
      <div className="user">
        <section className="avatar">
          <div className="avatar-header">
            <div className="avatar-icon">
              <Icon
                className="ellipse"
                src="/icon_ellipse.svg"
                alt="ellipse"
                width={60}
                height={60}
              />
              <Icon
                className="profile-empty"
                src="/icon_profile_empty.svg"
                alt="empty"
                width={27.75}
                height={28}
              />
            </div>
            <p className="avatar-greeting color-gray-01">
              안녕하세요, <span className="avatar-nick">{profile.nick}</span>님
            </p>
          </div>
          <div className="self-intro">한줄 자기소개</div>
          <div className="self-intro">폰 번호</div>
        </section>
      </div>
    </article>
  );
}
