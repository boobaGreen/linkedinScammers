import { LinkedInLoginButton } from "../components/auth/LinkdedInLoginButton";

const LoginPage = () => {
  return (
    <div className="container flex h-[80vh] w-full flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account
          </p>
        </div>

        <LinkedInLoginButton />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            {/* <span className="w-full border-t" /> */}
          </div>
          {/* <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with email
            </span>
          </div> */}
        </div>

        {/* <LoginForm /> */}
      </div>
    </div>
  );
};

export default LoginPage;
