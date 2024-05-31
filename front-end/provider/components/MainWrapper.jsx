import mainstyle from "./MainWrapper.module.css";

export default function MainWrapper({ children }) {
  return <div className={mainstyle.wrapper}>{children}</div>;
}
