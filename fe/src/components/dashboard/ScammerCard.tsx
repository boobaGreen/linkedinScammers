import React, { useState } from "react";
import { ScammerResponse, Report } from "../../api/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Trash2,
  CalendarIcon,
  UserIcon,
  LinkIcon,
  AlertCircle,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { deleteReport } from "../../api/scammerApi";
import { useToast } from "../../components/ui/use-toast";
import { useAuth } from "../../hooks/useAuth";

type BadgeColors = {
  bg: string;
  text: string;
};

// eslint-disable-next-line react-refresh/only-export-components
export const getScamTypeBadgeColors = (scamType: string): BadgeColors => {
  switch (scamType) {
    case "download-suspicios-repo":
      return {
        bg: "bg-[color:var(--color-purple-light)] dark:bg-[color:var(--color-purple-light)]",
        text: "text-[color:var(--color-purple-dark)] dark:text-[color:var(--color-purple-dark)]",
      };
    case "download-suspicios-software":
      return {
        bg: "bg-[color:var(--color-blue-light)] dark:bg-[color:var(--color-blue-light)]",
        text: "text-[color:var(--color-blue-dark)] dark:text-[color:var(--color-blue-dark)]",
      };
    case "investment-scam":
      return {
        bg: "bg-[color:var(--color-green-light)] dark:bg-[color:var(--color-green-light)]",
        text: "text-[color:var(--color-green-dark)] dark:text-[color:var(--color-green-dark)]",
      };
    case "romance-scam":
      return {
        bg: "bg-[color:var(--color-red-light)] dark:bg-[color:var(--color-red-light)]",
        text: "text-[color:var(--color-red-dark)] dark:text-[color:var(--color-red-dark)]",
      };
    case "other":
    default:
      return {
        bg: "bg-[color:var(--color-gray-light)] dark:bg-[color:var(--color-gray-light)]",
        text: "text-[color:var(--color-gray-dark)] dark:text-[color:var(--color-gray-dark)]",
      };
  }
};

interface ScammerCardProps {
  scammer: ScammerResponse;
  isUserReport: boolean;
  userId?: string;
  onReportDeleted?: () => void;
}

export const ScammerCard: React.FC<ScammerCardProps> = ({
  scammer,
  isUserReport,
  userId,
  onReportDeleted,
}) => {
  const { toast } = useToast();
  const { token } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  // Find user's report if this is in user reports section
  const userReport = isUserReport
    ? (scammer.reports?.find((report) => report?.reportedBy?._id === userId) as
        | Report
        | undefined)
    : null;

  // Use first report for community reports
  const primaryReport = userReport || (scammer.reports?.[0] as Report);
  const hasMultipleReports = scammer.reports?.length > 1;

  if (!primaryReport) return null; // Safety check

  // Extract profile username from URL for display
  const profileUsername =
    scammer.profileLink.split("/in/")[1]?.split("/")[0] || "Unknown Profile";

  const handleDeleteReport = async () => {
    if (!token || !userReport) return;

    try {
      setIsDeleting(true);
      await deleteReport(scammer._id, userReport._id, token);

      toast({
        title: "Report deleted",
        description: "Your report has been successfully deleted",
      });

      if (onReportDeleted) {
        onReportDeleted();
      }
    } catch (error) {
      console.error("Error deleting report:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete your report. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <LinkIcon size={16} className="text-amber-600" />
              <CardTitle className="text-lg">
                linkedin.com/in/{profileUsername}
              </CardTitle>
            </div>
            <div className="flex items-center mt-1 gap-1">
              <AlertCircle size={14} className="text-red-500" />
              <CardDescription className="text-red-600 font-medium">
                {scammer.reports.length} reports
              </CardDescription>
            </div>
          </div>

          {/* Show delete button only for user's own reports */}
          {isUserReport && userReport && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                  <span className="sr-only">Delete report</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete your report about this LinkedIn
                    profile. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteReport}
                    disabled={isDeleting}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    {isDeleting ? "Deleting..." : "Confirm Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        {/* Show user's report or first report prominently */}
        <div className="p-3 bg-[color:var(--color-card)] dark:bg-[color:var(--color-card)] rounded-md mb-3">
          <div className="flex justify-between">
            <div className="font-medium mb-1 text-[color:var(--color-card-foreground)]">
              {primaryReport.name}
            </div>
            <div className="text-sm text-[color:var(--color-muted-foreground)]">
              {primaryReport.company}
            </div>
          </div>
          <div className="text-sm">
            <span
              className={`inline-block px-2 py-0.5 ${
                getScamTypeBadgeColors(primaryReport.scamType).bg
              } ${
                getScamTypeBadgeColors(primaryReport.scamType).text
              } text-xs rounded-full mb-2`}
            >
              {primaryReport.scamType}
            </span>
            <p className="text-[color:var(--color-card-foreground)]">
              {primaryReport.notes}
            </p>
          </div>
        </div>

        {/* Show all reports */}
        {hasMultipleReports && scammer.reports && (
          <Accordion type="single" collapsible className="mt-2">
            <AccordionItem value="reports">
              <AccordionTrigger className="text-[color:var(--color-card-foreground)]">
                View all {scammer.reports.length} reported identities
              </AccordionTrigger>
              <AccordionContent>
                {scammer.reports.map((report, index) => (
                  <div
                    key={report._id}
                    className={`py-2 ${index > 0 ? "border-t mt-2" : ""}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-medium text-[color:var(--color-card-foreground)]">
                        {report.name}
                      </div>
                      <div className="text-sm text-[color:var(--color-muted-foreground)]">
                        {report.company}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-1 text-sm">
                      <UserIcon
                        size={14}
                        className="text-[color:var(--color-muted-foreground)]"
                      />
                      <span className="text-sm text-[color:var(--color-muted-foreground)]">
                        Reported by:{" "}
                        {report.reportedBy?.username || "Unknown User"}
                      </span>
                    </div>

                    <p className="text-sm mb-1 text-[color:var(--color-card-foreground)]">
                      <span
                        className={`inline-block px-2 py-0.5 ${
                          getScamTypeBadgeColors(report.scamType).bg
                        } ${
                          getScamTypeBadgeColors(report.scamType).text
                        } text-xs rounded-full mr-2`}
                      >
                        {report.scamType}
                      </span>
                      "{report.notes}"
                    </p>

                    <div className="flex items-center gap-2">
                      <CalendarIcon
                        size={14}
                        className="text-[color:var(--color-muted-foreground)]"
                      />
                      <span className="text-xs text-[color:var(--color-muted-foreground)]">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardContent>

      <CardFooter>
        <Button variant="outline" asChild className="w-full hover:bg-amber-50">
          <a
            href={
              scammer.profileLink.startsWith("http")
                ? scammer.profileLink
                : `https://${scammer.profileLink}`
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            View LinkedIn Profile
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};
