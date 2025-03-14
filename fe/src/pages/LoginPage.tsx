import { LinkedInLoginButton } from "../components/auth/LinkdedInLoginButton";

const LoginPage = () => {
  return (
    <div className="container flex h-[80vh] w-full flex-col items-center justify-center bg-[color:var(--color-background)]">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-[color:var(--color-foreground)]">
            Welcome back
          </h1>
          <p className="text-sm text-[color:var(--color-muted-foreground)]">
            Sign in to your account
          </p>
        </div>

        <LinkedInLoginButton />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            {/* <span className="w-full border-t border-[color:var(--color-border)]" /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
