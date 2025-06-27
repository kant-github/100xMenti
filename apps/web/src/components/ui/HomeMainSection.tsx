import React, { useState } from 'react';
import { Plus, Trophy, Users, Clock, BarChart3, Play, Edit3, Trash2, Eye } from 'lucide-react';

export default function HomeMainSection() {
    const [activeTab, setActiveTab] = useState('overview');

    const mockQuizzes = [
        {
            id: 1,
            title: "JavaScript Fundamentals",
            description: "Test your knowledge of JavaScript basics",
            questions: 15,
            participants: 234,
            createdAt: "2024-01-15",
            status: "active"
        },
        {
            id: 2,
            title: "React Advanced Concepts",
            description: "Deep dive into React hooks and patterns",
            questions: 20,
            participants: 189,
            createdAt: "2024-01-10",
            status: "draft"
        },
        {
            id: 3,
            title: "CSS Grid & Flexbox",
            description: "Master modern CSS layout techniques",
            questions: 12,
            participants: 156,
            createdAt: "2024-01-08",
            status: "active"
        }
    ];

    const stats = [
        { label: "Total Quizzes", value: "24", icon: Trophy, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Total Participants", value: "1,247", icon: Users, color: "text-green-600", bg: "bg-green-50" },
        { label: "Avg. Completion", value: "87%", icon: BarChart3, color: "text-purple-600", bg: "bg-purple-50" },
        { label: "Active Quizzes", value: "18", icon: Clock, color: "text-orange-600", bg: "bg-orange-50" }
    ];

    const QuizCard = ({ quiz }) => (
        <div className="bg-neutral-100 rounded-xl shadow-sm border border-neutral-200 hover:shadow-md transition-all duration-300 group">
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-neutral-800 mb-2 group-hover:text-blue-600 transition-colors">
                            {quiz.title}
                        </h3>
                        <p className="text-neutral-600 text-sm mb-3 line-clamp-2">
                            {quiz.description}
                        </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${quiz.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                        }`}>
                        {quiz.status}
                    </span>
                </div>

                <div className="flex items-center justify-between text-sm text-neutral-500 mb-4">
                    <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {quiz.questions} questions
                    </span>
                    <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {quiz.participants} participants
                    </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                    <span className="text-xs text-neutral-400">
                        Created {new Date(quiz.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors group/btn">
                            <Eye className="w-4 h-4 text-neutral-400 group-hover/btn:text-blue-600" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors group/btn">
                            <Edit3 className="w-4 h-4 text-neutral-400 group-hover/btn:text-green-600" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors group/btn">
                            <Play className="w-4 h-4 text-neutral-400 group-hover/btn:text-purple-600" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors group/btn">
                            <Trash2 className="w-4 h-4 text-neutral-400 group-hover/btn:text-red-600" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Navigation Tabs */}
                <div className='w-full flex items-center justify-end'>
                    <div className="flex items-center gap-1 mb-6 bg-white dark:bg-neutral-800 p-1 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 w-fit">
                        {[
                            { id: 'overview', label: 'Overview' },
                            { id: 'active', label: 'Active Quizzes' },
                            { id: 'drafts', label: 'Drafts' },
                            { id: 'analytics', label: 'Analytics' }
                        ].map((tab) => (
                            <button
                                type='button'
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${activeTab === tab.id
                                    ? 'bg-neutral-900 text-white shadow-sm'
                                    : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-700'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="space-y-6">
                    {activeTab === 'overview' && (
                        <>
                            {/* Recent Activity */}
                            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
                                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
                                    Recent Activity
                                </h2>
                                <div className="space-y-3">
                                    {[
                                        { action: "Quiz completed", quiz: "JavaScript Fundamentals", time: "2 hours ago", participants: 5 },
                                        { action: "New quiz created", quiz: "TypeScript Basics", time: "1 day ago", participants: 0 },
                                        { action: "Quiz updated", quiz: "React Hooks", time: "2 days ago", participants: 12 }
                                    ].map((activity, index) => (
                                        <div key={index} className="flex items-center justify-between py-3 border-b border-neutral-100 dark:border-neutral-700 last:border-b-0">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                                <div>
                                                    <p className="text-neutral-900 dark:text-white font-medium">
                                                        {activity.action}: <span className="text-blue-600">{activity.quiz}</span>
                                                    </p>
                                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{activity.time}</p>
                                                </div>
                                            </div>
                                            <span className="text-sm text-neutral-500 dark:text-neutral-400">
                                                {activity.participants} participants
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quiz Grid */}
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                                        Your Quizzes
                                    </h2>
                                    <div className="flex items-center gap-2">
                                        <select className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                            <option>All Status</option>
                                            <option>Active</option>
                                            <option>Draft</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {mockQuizzes.map((quiz) => (
                                        <QuizCard key={quiz.id} quiz={quiz} />
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab !== 'overview' && (
                        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-12 text-center">
                            <div className="max-w-md mx-auto">
                                <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Trophy className="w-8 h-8 text-neutral-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                                    Coming Soon
                                </h3>
                                <p className="text-neutral-600 dark:text-neutral-400">
                                    This section is under development. Check back soon for more features!
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};