import React, { useState, useEffect } from 'react';
import { BookOpen, Users, TrendingUp, Play, BarChart3, Zap, Star, ArrowRight, CheckCircle } from 'lucide-react';

export default function QuizLandingPage() {
    const [isVisible, setIsVisible] = useState(false);
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [votes, setVotes] = useState([85, 62, 94, 71]);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        
        const testimonialInterval = setInterval(() => {
            setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
        }, 4000);

        const chartInterval = setInterval(() => {
            setIsAnimating(true);
            setVotes(prev => {
                const newVotes = prev.map(() => Math.floor(Math.random() * 80) + 40);
                return newVotes;
            });
            
            setTimeout(() => setIsAnimating(false), 500);
        }, 2500);

        return () => {
            clearInterval(testimonialInterval);
            clearInterval(chartInterval);
        };
    }, []);

    const testimonials = [
        { name: "Sarah Chen", role: "Teacher", text: "This platform transformed how I engage my students. The real-time results are amazing!" },
        { name: "Mark Rodriguez", role: "Corporate Trainer", text: "Perfect for team building and training sessions. Highly recommended!" },
        { name: "Emily Davis", role: "Event Organizer", text: "Made our virtual events so much more interactive and fun!" }
    ];

    return (
        <div className="bg-neutral-100 overflow-hidden">

            
        
            <section className="relative z-10 px-6 pt-20 pb-32">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                                <Star className="w-4 h-4" />
                                Trusted by 10,000+ educators
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-bold text-slate-800 leading-tight mb-6">
                                Make Learning
                                <span className="bg-blue-600 bg-clip-text text-transparent"> Interactive</span>
                            </h1>
                            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                                Create engaging quizzes with real-time responses, beautiful analytics, and seamless participant experience. Perfect for education, training, and events.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button type='button' className="bg-neutral-900 text-white hover:bg-neutral-800 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                                    Start Creating <ArrowRight className="w-5 h-5" />
                                </button>
                                <button type='button' className="border-2 border-slate-300 text-slate-700 px-8 py-4 rounded-full text-lg font-semibold hover:border-slate-400 transition-all duration-300 flex items-center gap-2">
                                    <Play className="w-5 h-5" /> Watch Demo
                                </button>
                            </div>
                            <div className="flex items-center gap-8 mt-12 text-sm text-slate-500">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    No setup required
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    Free to start
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    Works everywhere
                                </div>
                            </div>
                        </div>

                        <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <div className="relative">
                                <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl p-8 border border-slate-200 relative overflow-hidden">
                                    
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm">
                                            <Users className="w-4 h-4" />
                                            247 participants
                                        </div>
                                        <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm">
                                            <TrendingUp className="w-4 h-4" />
                                            Live
                                        </div>
                                    </div>

                                    <div className="text-center mb-8">
                                        <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                                            <BookOpen className="w-4 h-4" />
                                            Question 3 of 10
                                        </div>
                                        <h3 className="text-xl font-semibold text-slate-800 mb-6">
                                            What's your favorite way to learn?
                                        </h3>
                                    </div>

                                    <div className="flex items-end justify-center gap-4 h-32">
                                        {[
                                            { label: "Videos", color: "bg-blue-500" },
                                            { label: "Reading", color: "bg-green-500" },
                                            { label: "Practice", color: "bg-purple-500" },
                                            { label: "Discussion", color: "bg-orange-500" }
                                        ].map((option, idx) => (
                                            <div key={idx} className="flex flex-col items-center flex-1">
                                                <div className={`text-sm font-medium text-slate-700 mb-2 transition-all duration-300 ${isAnimating ? 'scale-110' : 'scale-100'}`}>
                                                    {Math.round(votes[idx])}
                                                </div>
                                                <div 
                                                    className={`w-full ${option.color} rounded-tr-lg transition-all duration-1000 ease-in-out transform ${isAnimating ? 'scale-x-105' : 'scale-x-100'}`}
                                                    style={{ height: `${votes[idx]}px` }}
                                                />
                                                <div className="text-xs text-slate-600 mt-2 text-center">
                                                    {option.label}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="absolute top-4 right-4 w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
                                    <div className="absolute bottom-8 left-4 w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-1000"></div>
                                </div>

                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-2xl -z-10 scale-110"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}