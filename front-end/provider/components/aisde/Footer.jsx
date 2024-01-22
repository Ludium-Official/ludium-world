import Link from "next/link";
import Icon from "../Icon";
import Logo2 from "./Logo2";

export default function Footer() {
  return (
    <footer className="footer">
      <Logo2 />
      <address className="address">
        <div className="address-inner">
          <div>
            <p className="address-text">개인정보처리방침 l 이용약관</p>
            <p className="address-text">(주)루디움 l 대표자 : 임동선</p>
            <p className="address-text">개인정보보호책임자 : 임동선</p>
          </div>
          <div>
            <p className="address-text contact-us">Contact us</p>
          </div>
          <div className="address-inner">
            <Link className="address-text sns" href="#">
              <div className="sns-icon">
                <Icon src="icon_x.svg" alt="X" width={16} height={15} />
              </div>
              Twitter
            </Link>
            <Link className="address-text sns" href="#">
              <div className="sns-icon">
                <Icon
                  src="icon_discord.svg"
                  alt="discord"
                  width={13.333}
                  height={10.667}
                />
              </div>
              Discord
            </Link>
            <Link className="address-text sns" href="#">
              <Icon
                src="icon_youtube.svg"
                alt="youtube"
                width={16}
                height={16}
              />
              Youtube
            </Link>
            <Link className="address-text sns" href="#">
              <div className="sns-icon">
                <Icon
                  src="icon_customer_service.svg"
                  alt="custoer service"
                  width={15.333}
                  height={14.667}
                />
              </div>
              Customer Service
            </Link>
          </div>
        </div>
        <div>
          <p className="address-text">&copy;2024 LUDIUM</p>
          <p className="address-text">.ALL RIGHTS RESERVED.</p>
        </div>
      </address>
    </footer>
  );
}
