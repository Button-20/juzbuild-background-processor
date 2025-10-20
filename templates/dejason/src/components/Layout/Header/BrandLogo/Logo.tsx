import Image from "next/image";

const Logo: React.FC<{
  isHomepage?: boolean;
  sticky?: boolean;
}> = ({ isHomepage, sticky }: { isHomepage?: boolean; sticky?: boolean }) => {
  return (
    <>
      <Image
        src={"https://res.cloudinary.com/dho8jec7k/image/upload/w_200,h_48,c_fit,f_auto,q_auto/v1760945351/juzbuild/logos/logo_1760945350225_yx1b361kufp.webp"}
        alt="logo"
        width={150}
        height={68}
        unoptimized={true}
        className={`w-30 h-auto sm:w-32 lg:w-[180px] ${
          isHomepage
            ? sticky
              ? "block dark:hidden"
              : "hidden"
            : sticky
            ? "block dark:hidden"
            : "block dark:hidden"
        }`}
      />
      <Image
        src={"https://res.cloudinary.com/dho8jec7k/image/upload/w_200,h_48,c_fit,f_auto,q_auto/v1760945351/juzbuild/logos/logo_1760945350225_yx1b361kufp.webp"}
        alt="logo"
        width={150}
        height={68}
        unoptimized={true}
        className={`w-30 h-auto sm:w-32 lg:w-[180px] ${
          isHomepage
            ? sticky
              ? "hidden dark:block"
              : "block"
            : sticky
            ? "dark:block hidden"
            : "dark:block hidden"
        }`}
      />
    </>
  );
};

export default Logo;
