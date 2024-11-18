import Image from "next/image";
import MainLogoGray from "@images/mainLogoGray.svg";
import GithubIcon from "@images/github.svg";
import Link from "next/link";
import ScrollTopButton from "../common/button/ScrollTopButton";

const Footer = () => {
  const githubLink = [
    "https://github.com/duddlfkd02",
    "https://github.com/star1024cd",
    "https://github.com/slppills",
    "https://github.com/jeongol"
  ];
  const devName = ["김하영", "신한별", "선채훈", "이정곤"];

  return (
    <>
      <ScrollTopButton />
      <footer className="bg-Gray-50 px-[2.5rem] pb-[2rem] pt-[3rem]">
        <div className="mx-auto lg:w-[56rem] xl:w-[64rem]">
          <div className="flex items-center justify-between">
            <div className="relative hidden h-[3.5rem] w-[7.21875rem] lg:block">
              <Image src={MainLogoGray} fill alt="메인 로고" />
            </div>
            <div className="flex flex-row gap-[2.56rem] md:flex-col md:gap-[1.375rem] lg:pr-[7rem]">
              <div className="flex flex-col items-center md:flex-row">
                <p className="text-Gray-400">Developer</p>
                <div className="mt-4 flex flex-col gap-4 md:ml-12 md:mt-0 md:flex-row md:gap-10">
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
              <div className="flex flex-col items-center md:flex-row">
                <p className="text-Gray-400">Designer</p>
                <div className="mt-4 flex flex-col gap-4 md:ml-12 md:mt-0 md:flex-row md:gap-10">
                  <p>박예림</p>
                  <p>임효연</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-11 w-full border border-Gray-200"></div>
          <p className="mt-4 text-center text-[13px] text-Gray-200">
            2024.11.Sparta Coding Club React Project zipbob-lab
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
