import Image from "next/image";
import MAinLogo from "@images/mainLogo.svg";
import GithubIcon from "@images/github.svg";
import Link from "next/link";

const Footer = () => {
  const githubLink = [
    "https://github.com/duddlfkd02",
    "https://github.com/star1024cd",
    "https://github.com/slppills",
    "https://github.com/jeongol"
  ];
  const devName = ["김하영", "신한별", "선채훈", "이정곤"];

  return (
    <footer className="bg-Gray-50 px-[2.5rem] pb-[2rem] pt-[3rem]">
      <div className="flex justify-between px-[2.5rem]">
        <Image src={MAinLogo} width={164} height={80} alt="메인 로고" />
        <div className="flex flex-col gap-[1.375rem] pr-[7rem]">
          <div className="flex items-center">
            <p className="text-[#FF9143]">Developer</p>
            <div className="ml-12 flex gap-10">
              {Array(4)
                .fill(0)
                .map((_, index) => (
                  <div className="flex items-center gap-4" key={index}>
                    <Link href={githubLink[index]} target="_blank">
                      <Image src={GithubIcon} alt="깃허브 아이콘" />
                    </Link>
                    <p>{devName[index]}</p>
                  </div>
                ))}
            </div>
          </div>
          <div className="flex items-center">
            <p className="text-[#FF9143]">Designer</p>
            <div className="ml-12 flex gap-10">
              <p>박예림</p>
              <p>임효연</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-11 w-full border border-Gray-200"></div>
      <p className="mt-4 text-center text-[13px] text-Gray-200">2024.11.Sparta Coding Club React Project zipbob-lab</p>
    </footer>
  );
};

export default Footer;
