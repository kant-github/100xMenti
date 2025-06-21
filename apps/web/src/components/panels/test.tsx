import { Eye, Clock, BookOpen } from 'lucide-react';
import { templates } from './Panels';
import { useCurrentQuestionStore, useQuizDataStore } from '@/zustand/quizStore';



export default function LeftPanel() {

    const { quizData } = useQuizDataStore();

    const { currentQuestion } = useCurrentQuestionStore();
    const currentQ = quizData.questions[currentQuestion];
    const selectedTemplate = templates.find(t => t.id === quizData.template);


    const PreviewPanel = () => (
        <div className={`h-full flex flex-col ${selectedTemplate.bg}`}>
            {/* Preview Header */}
            <div className="text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    <span className="font-medium">Live Preview</span>
                </div>
                <div className="text-sm text-gray-300">
                    Question {currentQuestion + 1} of {quizData.totalQuestions}
                </div>
            </div>

            {/* Quiz Preview */}
            <div className={`flex-1 p-8 flex flex-col justify-center relative overflow-hidden`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="w-full h-full" style={{
                        backgroundImage: `radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)`
                    }} />
                </div>

                {/* Quiz Title */}
                <div className="text-center mb-12 relative z-10">
                    <h1 className="text-4xl font-bold text-white mb-2">{quizData.title}</h1>
                    <div className="flex items-center justify-center gap-6 text-white/80 text-sm">
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{currentQ?.timing || quizData.timing}s per question</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            <span>{quizData.totalQuestions} questions</span>
                        </div>
                    </div>
                </div>

                {/* Question Display */}
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl relative z-10 max-w-4xl mx-auto w-full">
                    <div className="text-center mb-8">
                        <div className="text-lg font-medium text-gray-600 mb-2">
                            Question {currentQuestion + 1}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 leading-relaxed">
                            {currentQ?.question}
                        </h2>
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-2 gap-4">
                        {currentQ?.options.map((option, idx) => (
                            <div
                                key={idx}
                                className={`p-4 rounded-xl border-2 transition-all cursor-pointer hover:scale-[1.02] text-gray-800 ${currentQ.correctAnswer === idx
                                    ? `shadow-lg border-[1px] border-green-500/50 bg-green-900/20`
                                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentQ.correctAnswer === idx ? 'bg-white/20 text-white border border-green-500' : 'bg-gray-200 text-gray-600'
                                        }`}>
                                        {String.fromCharCode(65 + idx)}
                                    </div>
                                    <span className="font-medium">{option}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Timer Visualization */}
                    <div className="mt-8 flex justify-center">
                        <div className="flex items-center gap-2 text-gray-500">
                            <Clock className="w-4 h-4" />
                            <div className="text-sm">Time: {currentQ?.timing || quizData.timing} seconds</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-[70%] h-full overflow-hidden">
            <div className="h-full overflow-y-auto shadow-lg">
                <PreviewPanel />
            </div>
        </div>
    );
};
