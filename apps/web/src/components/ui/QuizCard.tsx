import { CustomSession, QuizType } from "@/types/types";
import { Clock, FileText, Calendar, MoreVertical, Edit, Trash2, Play, Rocket } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import LaunchQuizModal from "./LaunchQuizModal";
import axios from "axios";
import { DELETE_QUIZ_URL, LAUNCH_QUIZ_URL, PUBLISH_QUIZ_URL } from "@/lib/api_routes";
import { useRouter } from "next/navigation";
import PublishQuizModal from "./PublishQuizModal";
import { useOwnerQuizsStore } from "@/zustand/ownerQuizsStore";
import { useToast } from "@/hooks/useToast";
import PublishedTicker from "../ticker/PublishedTicker";
import DeleteQuizModal from "./DeleteQuizModal";

interface QuizCardProps {
    quiz: QuizType;
    session: CustomSession;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function QuizCard({ quiz, session, setOpen }: QuizCardProps) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [openLaunchQuizModal, setOpenLaunchQuizModal] = useState(false);
    const [openPublishQuizModal, setOpenPublishQuizModal] = useState(false);
    const [openDeleteQuizModal, setOpenDeleteQuizModal] = useState(false);
    const router = useRouter();
    const { toast } = useToast()
    const [loading, setLoading] = useState<boolean>(false);
    const { setQuizs, removeQuiz } = useOwnerQuizsStore()

    async function deleteQuizHandler(quizId: string) {
        if (!quizId || !session.user.token) {
            toast({
                title: "Error",
                description: "Missing quiz ID or authentication token",
            });
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.delete(`${DELETE_QUIZ_URL}/${quizId}`, {
                headers: {
                    Authorization: `Bearer ${session.user.token}`
                }
            })

            if (data.success) {
                removeQuiz(data.quizId);
                toast({
                    title: "Success",
                    description: data.message || "Quiz deleted successfully",
                });
            }
            setOpen(true);
        } catch (err) {
            console.error("Error in publishing the quiz", err);
        } finally {
            setLoading(false);
            setOpenPublishQuizModal(false);
        }
    }

    async function publishQuizHandler(quizId: string) {
        if (!quizId || !session.user.token) {
            toast({
                title: "Error",
                description: "Missing quiz ID or authentication token",
            });
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.post(`${PUBLISH_QUIZ_URL}/${quizId}`, {}, {
                headers: {
                    Authorization: `Bearer ${session.user.token}`
                }
            })

            if (data.success) {
                setQuizs({
                    ...quiz,
                    isPublished: true
                });
                toast({
                    title: "Success",
                    description: data.message || "Quiz published successfully",
                });
            } else {
                toast({
                    title: "Failed to publish quiz",
                    description: data.message || "An error occurred while publishing the quiz",
                });
            }
            setOpen(true);
        } catch (err: any) {
            console.error("Error in publishing the quiz", err);

            // Handle different types of errors
            let errorMessage = "Failed to publish quiz";
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }

            toast({
                title: "Error",
                description: errorMessage,
            });
        } finally {
            setLoading(false);
            setOpenPublishQuizModal(false);
        }
    }



    async function launchQuizHandler(quizId: string) {
        if (!quizId || !session.user.token) {
            toast({
                title: "Error",
                description: "Missing quiz ID or authentication token",
            });
            return;
        }

        try {
            setLoading(true);

            const { data } = await axios.post(`${LAUNCH_QUIZ_URL}/${quizId}`, {}, {
                headers: {
                    Authorization: `Bearer ${session.user.token}`
                }
            });

            console.log("Launch response data:", data);

            if (data.success) {
                toast({
                    title: "Success",
                    description: data.message || "Quiz launched successfully",
                    variant: "default"
                });
                sessionStorage.setItem('host_token', data.data.hostToken);
                setOpenLaunchQuizModal(false);
                router.push(`/live/${quiz.id}`);
            } else {
                let errorTitle = "Failed to launch quiz";
                let errorDescription = data.message || "An error occurred while launching the quiz";

                if (data.message?.includes("must be published")) {
                    errorTitle = "Quiz not published";
                    errorDescription = "You need to publish the quiz before launching it";
                } else if (data.message?.includes("active session")) {
                    errorTitle = "Quiz already active";
                    errorDescription = `Quiz already has an active session${data.sessionCode ? ` (Code: ${data.sessionCode})` : ''}`;
                } else if (data.message?.includes("at least one question")) {
                    errorTitle = "No questions found";
                    errorDescription = "Quiz must have at least one question to launch";
                }

                toast({
                    title: errorTitle,
                    description: errorDescription,
                });

                // Keep modal open for user to see the error and potentially fix issues
                setOpen(true);
            }

        } catch (err: any) {
            console.error("Error in launching the quiz", err);

            // Handle different types of errors
            let errorMessage = "Failed to launch quiz";
            let errorTitle = "Error";

            if (err.response?.status === 401) {
                errorTitle = "Unauthorized";
                errorMessage = "Your session has expired. Please log in again.";
            } else if (err.response?.status === 404) {
                errorTitle = "Quiz not found";
                errorMessage = "The quiz you're trying to launch could not be found.";
            } else if (err.response?.status === 400) {
                errorMessage = err.response?.data?.message || "Invalid request parameters";
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }

            toast({
                title: errorTitle,
                description: errorMessage,
                variant: "destructive"
            });

            // Keep modal open for error cases
            setOpen(true);

        } finally {
            setLoading(false);
            setOpenLaunchQuizModal(false);
        }
    }

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const estimatedDuration = quiz.questions ? Math.ceil(quiz.questions.length * 0.5) : 0;

    function handleAction(action: string, e: React.MouseEvent) {
        e.stopPropagation();
        setShowDropdown(false);

        switch (action) {
            case 'launch':
                setOpenLaunchQuizModal(true);
                setOpen(false);
                break;
            case 'delete':
                setOpenDeleteQuizModal(true);
                setOpen(false);
                break;
            case 'publish':
                setOpenPublishQuizModal(true);
                setOpen(false);
                break;
        }
    };

    function handleCardClick() {
        router.push(`/quiz/${quiz.id}`);
    };

    return (
        <div
            className="group relative bg-neutral-100 border-[1px] border-neutral-300 rounded-xl p-5 hover:shadow-sm hover:border-gray-300 transition-all duration-200 cursor-pointer mb-4 ease-in"
            onClick={handleCardClick}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate transition-colors">
                        {quiz.title}
                    </h3>
                    {quiz.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {quiz.description}
                        </p>
                    )}
                </div>

                <div className="relative">
                    <button
                        aria-label="option"
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowDropdown(!showDropdown);
                        }}
                        className="p-1 rounded-lg hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>

                    {showDropdown && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setShowDropdown(false)}
                            />

                            <div className="absolute right-0 top-8 z-20 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                                <button
                                    type="button"
                                    onClick={(e) => handleAction('launch', e)}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
                                >
                                    <Rocket className="w-4 h-4" />
                                    Launch
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => handleAction('publish', e)}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
                                >
                                    <Play className="w-4 h-4" />
                                    Publish
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => handleAction('edit', e)}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit Quiz
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => handleAction('delete', e)}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Quiz Stats */}
            <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                    <FileText className="w-4 h-4" />
                    <span>{quiz.questions?.length || 0} questions</span>
                </div>

                {estimatedDuration > 0 && (
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>~{estimatedDuration} min</span>
                    </div>
                )}
                {quiz.isPublished && (
                    <PublishedTicker />
                )}

            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>Created {formatDate(quiz.createdAt.toString())}</span>
                </div>

                <div className="flex items-center gap-2">
                    {/* Draft Status */}
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                        <span className="text-xs text-orange-600 font-medium">Draft</span>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            type="button"
                            onClick={(e) => handleAction('edit', e)}
                            className="p-1 rounded hover:bg-blue-50 text-blue-600 transition-colors"
                            title="Edit quiz"
                        >
                            <Edit className="w-3 h-3" />
                        </button>
                        <button
                            type="button"
                            onClick={(e) => handleAction('preview', e)}
                            className="p-1 rounded hover:bg-green-50 text-green-600 transition-colors"
                            title="Preview quiz"
                        >
                            <Play className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>
            {openLaunchQuizModal && <LaunchQuizModal setOpen={setOpen} loading={loading} quiz={quiz} setOpenLaunchQuizModal={setOpenLaunchQuizModal} launchQuizHandler={launchQuizHandler} />}
            {openPublishQuizModal && <PublishQuizModal loading={loading} quiz={quiz} setOpenPublishQuizModal={setOpenPublishQuizModal} publishQuizHandler={publishQuizHandler} />}
            {openDeleteQuizModal && <DeleteQuizModal loading={loading} quiz={quiz} setOpenDeleteQuizModal={setOpenDeleteQuizModal} deleteQuizHandler={deleteQuizHandler} setOpen={setOpen} />}
        </div>
    );
}