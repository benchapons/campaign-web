const LoaderAuth = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-blue-light h-screen ">
      <div className=" opacity-50 animate-spin inline-block h-12 w-12  border-r-transparent rounded-full border-8 mb-12"></div>
      <div className="opacity-50 animate-bounce text-center text-3xl ">กำลังเข้าสู่ระบบ...</div>
    </div>
  );
};

export default LoaderAuth;
