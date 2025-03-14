import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/button";
import { ScammerSearch } from "../components/scammers/ScammerSearch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Shield, AlertTriangle, CheckCircle } from "lucide-react";

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container px-4 py-12 md:py-24 bg-[color:var(--color-background)]">
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center">
        {/* Desktop view: horizontal layout (shield left of text) */}
        <div className="hidden md:flex md:items-center md:space-x-2">
          <Shield className="h-12 w-12 text-[color:var(--color-primary)]" />
          <h1 className="text-4xl font-bold text-[color:var(--color-foreground)]">
            LinkedIn Scammer Blacklist
          </h1>
        </div>

        {/* Mobile view: vertical layout (shield below text) */}
        <div className="flex flex-col items-center space-y-3 md:hidden">
          <h1 className="text-3xl font-bold text-[color:var(--color-foreground)]">
            LinkedIn Scammer Blacklist
          </h1>
          <Shield className="h-12 w-12 text-[color:var(--color-primary)]" />
        </div>

        <p className="mt-6 max-w-[42rem] text-xl text-[color:var(--color-muted-foreground)]">
          Protect yourself from LinkedIn scammers. Report suspicious profiles
          and verify recruiters before responding.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {isAuthenticated ? (
            <Link to="/report">
              <Button
                size="lg"
                className="h-12 border-1 hover:bg-[color:var(--color-primary-light)] dark:hover:bg-[color:var(--color-primary-dark)]"
              >
                Report a Scam
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 border-[color:var(--color-border)] hover:bg-[color:var(--color-primary-light)] dark:hover:bg-[color:var(--color-primary-dark)]"
                >
                  Login
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Search Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-6 text-[color:var(--color-foreground)]">
          Check if a Profile Has Been Reported
        </h2>
        <ScammerSearch />
      </div>

      {/* Features Section */}
      <div className="mt-24 grid gap-6 md:grid-cols-3">
        {/* Report Scam Card - Red accent */}
        <Card className="border-[color:var(--color-border)] bg-[color:var(--color-card)]">
          <div className="h-1.5 w-full bg-red-500 rounded-t-md"></div>
          <CardHeader className="space-y-1 pt-5">
            <CardTitle className="flex items-center gap-2 text-[color:var(--color-card-foreground)]">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Report Scam
            </CardTitle>
            <CardDescription className="text-[color:var(--color-muted-foreground)]">
              Help protect others in the community
            </CardDescription>
          </CardHeader>
          <CardContent className="text-[color:var(--color-card-foreground)]">
            <p>
              Document and report fake recruiters, fraudulent job offers, and
              other scams you encounter on LinkedIn.
            </p>
          </CardContent>
        </Card>

        {/* Verify Recruiters Card - Green accent */}
        <Card className="border-[color:var(--color-border)] bg-[color:var(--color-card)]">
          <div className="h-1.5 w-full bg-green-500 rounded-t-md"></div>
          <CardHeader className="space-y-1 pt-5">
            <CardTitle className="flex items-center gap-2 text-[color:var(--color-card-foreground)]">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Verify Recruiters
            </CardTitle>
            <CardDescription className="text-[color:var(--color-muted-foreground)]">
              Check before responding to messages
            </CardDescription>
          </CardHeader>
          <CardContent className="text-[color:var(--color-card-foreground)]">
            <p>
              Search our database to check if a recruiter or company has been
              reported before engaging with them.
            </p>
          </CardContent>
        </Card>

        {/* Stay Protected Card - Amber accent */}
        <Card className="border-[color:var(--color-border)] bg-[color:var(--color-card)]">
          <div className="h-1.5 w-full bg-amber-500 rounded-t-md"></div>
          <CardHeader className="space-y-1 pt-5">
            <CardTitle className="flex items-center gap-2 text-[color:var(--color-card-foreground)]">
              <Shield className="h-5 w-5 text-amber-500" />
              Stay Protected
            </CardTitle>
            <CardDescription className="text-[color:var(--color-muted-foreground)]">
              Learn to identify common scam patterns
            </CardDescription>
          </CardHeader>
          <CardContent className="text-[color:var(--color-card-foreground)]">
            <p>
              Access resources and tips on how to identify and avoid common
              LinkedIn scams targeting job seekers.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
