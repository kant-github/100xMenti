import { QuizType } from "@/types/types";
import { Clock, FileText, Calendar, MoreVertical, Edit, Trash2, Play } from "lucide-react";
import { useState } from "react";

interface QuizCardProps {
    quiz: QuizType;
}

export default function QuizCard({ quiz }: QuizCardProps) {
    const [showDropdown, setShowDropdown] = useState(false);

    // Format date to readable format
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Calculate estimated duration (assuming 30 seconds per question)
    const estimatedDuration = quiz.questions ? Math.ceil(quiz.questions.length * 0.5) : 0;

    const handleAction = (action: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDropdown(false);

        switch (action) {
            case 'edit':
                console.log('Edit quiz:', quiz.id);
                break;
            case 'delete':
                console.log('Delete quiz:', quiz.id);
                break;
            case 'preview':
                console.log('Preview quiz:', quiz.id);
                break;
        }
    };

    const handleCardClick = () => {
        // Navigate to quiz editor or details
        console.log('Open quiz:', quiz.id);
    };

    return (
        <div
            className="group relative bg-neutral-100 border-[1px] border-neutral-300 rounded-xl p-5 hover:shadow-sm hover:border-gray-300 transition-all duration-200 cursor-pointer mb-4 ease-in"
            onClick={handleCardClick}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
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
                                    onClick={(e) => handleAction('edit', e)}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit Quiz
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => handleAction('preview', e)}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
                                >
                                    <Play className="w-4 h-4" />
                                    Preview
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
        </div>
    );
}