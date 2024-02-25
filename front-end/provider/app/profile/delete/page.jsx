import BackButton from "@/components/BackButton";
import DeleteAccount from "./DeleteAccount";

export default async function DeleteAccountPage() {
  return (
    <>
      <header className="nb">
        <BackButton />
      </header>
      <section className="wrapper">
        <div className="frame-93-7">
          <div className="frame-57">
            <h3 className="h3-24">회원 탈퇴 약관</h3>
          </div>
          <div className="frame background-white border-gray-06">
            <div className="frame-101">
              <p>
                본 약관은 회원님이 루디움의 회원 탈퇴를 신청할 경우 적용되는
                조건과 절차에 대해 설명합니다. 탈퇴 절차를 진행하기 전에{" "}
                <span className="color-alert">
                  아래의 내용을 주의 깊게 읽어주시기 바랍니다.
                </span>
              </p>
            </div>
            <ol>
              <li>
                정보 및 게시물 삭제
                <p>
                  회원 탈퇴 시, 이메일과 연계된 모든 사적인 영역의 정보 및
                  개인적인 게시물은 삭제됩니다. 단, 기존에 작성하신 게시물은
                  삭제되지 않으며, 작성자 명은{" "}
                  <span className="color-gray-02">탈퇴한 회원</span>으로 일괄
                  변경됩니다. 이는 커뮤니티 내의 정보 연속성을 유지하기
                  위함입니다.
                </p>
              </li>
              <li>
                재가입 정책
                <p>
                  회원 탈퇴 후, 재가입을 희망하실 경우 가능합니다. 다만, 재가입
                  시 새로운 아이디를 생성하는 과정을 거쳐야 하며, 이전
                  아이디로의 복구는 <span className="color-alert">불가능</span>{" "}
                  합니다.
                </p>
              </li>
              <li>
                개인정보 보유 및 삭제
                <p>
                  회원 탈퇴 시, 구글 ID, 닉네임, 자기소개를 비롯한 개인 정보는
                  모두 삭제됩니다. 단, 특정 게시글은{" "}
                  <span className="color-gray-02">탈퇴한 회원</span> 형태로 남게
                  되며, 이는 커뮤니티의 토론 및 정보 공유의 연속성을 위해 필요한
                  최소한의 조치입니다.
                </p>
              </li>
              <li>
                기타 정보 삭제
                <p>
                  탈퇴 과정에서 회원님의 개인 정보와 관련된 모든 데이터는
                  루디움의{" "}
                  <span className="color-alert">데이터베이스에서 삭제</span>
                  됩니다. 이는 개인정보 보호 및 데이터 보안을 위한 조치입니다.
                </p>
              </li>
              <li>
                주의 사항
                <p>
                  탈퇴 후, 이전에 이용하셨던 이메일로는 동일한 아이디로 재가입이
                  불가능합니다. 재가입을 원하실 경우, 새로운 아이디 생성이
                  필요합니다.
                </p>
                <p>
                  회원 탈퇴를 신청하시기 전에, 보유하신 모든 데이터와 정보를
                  확인하시기 바랍니다. 탈퇴 절차 완료 후, 복구는 불가능합니다.
                </p>
                <p>
                  본 약관에 동의하실 경우, 아래의{" "}
                  <span className="color-alert">탈퇴 신청</span> 버튼을 클릭하여
                  탈퇴 절차를 진행해주시기 바랍니다. 탈퇴 과정에 대해 궁금한
                  점이 있으시다면, 언제든지 고객 지원 서비스를 통해 문의하실 수
                  있습니다.
                </p>
              </li>
            </ol>
            <DeleteAccount />
          </div>
        </div>
      </section>
    </>
  );
}
