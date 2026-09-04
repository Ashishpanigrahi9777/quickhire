import React, { useState } from 'react';
import { FileSearch, RotateCcw, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { analyzeResume } from '../api/resume';

import ResumeUpload from '../components/ResumeUpload';
import ResumeScoreCard from '../components/ResumeScoreCard';
import ResumeStrengths from '../components/ResumeStrengths';
import ResumeSectionAnalysis from '../components/ResumeSectionAnalysis';
import KeywordAnalysis from '../components/KeywordAnalysis';
import RoleMatch from '../components/RoleMatch';
import ResumeActionPlan from '../components/ResumeActionPlan';

class ResumeReviewerErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="mx-auto max-w-2xl rounded-xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300" role="alert">
                    <h2 className="font-semibold">We could not display this analysis</h2>
                    <p className="mt-1 text-sm">The analysis contained unexpected data. Please upload the resume again.</p>
                    <button className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white" onClick={() => window.location.reload()}>
                        Return to reviewer
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

const toSafeStringArray = (value) => Array.isArray(value)
    ? value.filter((item) => typeof item === 'string').map((item) => item.trim()).filter(Boolean)
    : [];

const getAnalysisErrorMessage = (error) => {
    const detail = error?.response?.data?.detail;
    if (Array.isArray(detail)) {
        const messages = detail
            .map((item) => (typeof item === 'string' ? item : item?.msg))
            .filter(Boolean);
        if (messages.length > 0) return messages.join('; ');
    }
    if (typeof detail === 'string' && detail.trim()) return detail;
    if (error instanceof Error && !error.response && error.message) return error.message;
    return 'Resume analysis failed. Please try again.';
};

const ResumeReviewer = () => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState(null);
    const [analysisError, setAnalysisError] = useState(null);

    const normalizeAnalysis = (payload) => {
        const candidate = payload?.result || payload?.analysis || payload;
        if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
            throw new Error('The analysis response was not a valid object.');
        }

        const sectionAnalysis = candidate.section_analysis;
        const targetRole = candidate.target_role;
        const keywords = candidate.keywords;
        if (!sectionAnalysis || typeof sectionAnalysis !== 'object' || Array.isArray(sectionAnalysis) ||
            !keywords || typeof keywords !== 'object' || Array.isArray(keywords) ||
            !targetRole || typeof targetRole !== 'object' || Array.isArray(targetRole)) {
            throw new Error('The analysis response is missing required sections.');
        }

        return {
            overall_score: Number.isFinite(Number(candidate.overall_score)) ? Number(candidate.overall_score) : 0,
            ats_score: Number.isFinite(Number(candidate.ats_score)) ? Number(candidate.ats_score) : 0,
            summary: typeof candidate.summary === 'string' ? candidate.summary : 'Not available',
            strengths: toSafeStringArray(candidate.strengths),
            improvements: toSafeStringArray(candidate.improvements),
            section_analysis: sectionAnalysis,
            keywords: {
                matched_keywords: toSafeStringArray(keywords.matched_keywords),
                missing_keywords: toSafeStringArray(keywords.missing_keywords),
            },
            target_role: {
                role_match_score: Number.isFinite(Number(targetRole.role_match_score)) ? Number(targetRole.role_match_score) : 0,
                matching_points: toSafeStringArray(targetRole.matching_points),
                missing_requirements: toSafeStringArray(targetRole.missing_requirements),
            },
            action_plan: Array.isArray(candidate.action_plan)
                ? candidate.action_plan
                    .filter((action) => action && typeof action === 'object' && !Array.isArray(action))
                    .map((action) => ({
                        priority: action.priority ?? 3,
                        recommendation: typeof action.recommendation === 'string' ? action.recommendation : 'Review this recommendation',
                        reason: typeof action.reason === 'string' ? action.reason : 'No additional reason provided',
                    }))
                : [],
        };
    };

    const handleUpload = async (file) => {
        setIsAnalyzing(true);
        setResults(null);
        setAnalysisError(null);
        try {
            const data = await analyzeResume(file);
            setResults(normalizeAnalysis(data));
            toast.success("Resume analyzed successfully!");
        } catch (error) {
            console.error("Analysis failed:", error);
            const errorMessage = getAnalysisErrorMessage(error);
            setAnalysisError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                    <Sparkles className="h-3.5 w-3.5" /> AI career feedback
                </div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">AI Resume Reviewer</h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                    Get instant, AI-powered feedback on your resume to improve your ATS score and land more interviews.
                </p>
            </div>

            {!results && (
                <ResumeUpload onUpload={handleUpload} isAnalyzing={isAnalyzing} />
            )}

            {analysisError && !isAnalyzing && (
                <div className="mx-auto max-w-2xl rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300" role="alert">
                    <p className="font-semibold">We could not display this analysis</p>
                    <p className="mt-1">{analysisError}</p>
                </div>
            )}

            {isAnalyzing && !results && (
                <div className="text-center mt-12 space-y-4">
                    <p className="text-slate-500 animate-pulse">Our AI is reading and analyzing your resume...</p>
                </div>
            )}

            {results && (
                <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Analysis Results</h2>
                        <button
                            onClick={() => setResults(null)}
                            className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                        >
                            <RotateCcw className="mr-2 inline h-4 w-4" /> Upload Another Resume
                        </button>
                    </div>

                    {results.summary && (
                        <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-xl border border-primary-100 dark:border-primary-900/50 mb-8 text-primary-900 dark:text-primary-100 text-sm md:text-base">
                            <div className="mb-2 flex items-center gap-2 font-semibold"><FileSearch className="h-4 w-4" /> Resume summary</div>
                            {results.summary}
                        </div>
                    )}

                    <ResumeScoreCard 
                        overallScore={results.overall_score} 
                        atsScore={results.ats_score} 
                    />

                    <ResumeStrengths 
                        strengths={results.strengths || []} 
                        improvements={results.improvements || []} 
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <ResumeSectionAnalysis sections={results.section_analysis || {}} />
                            <ResumeActionPlan actionPlan={results.action_plan || []} />
                        </div>
                        
                        <div className="space-y-8">
                            <KeywordAnalysis keywords={results.keywords || { matched_keywords: [], missing_keywords: [] }} />
                            <RoleMatch targetRole={results.target_role} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default function ResumeReviewerWithBoundary() {
    return (
        <ResumeReviewerErrorBoundary>
            <ResumeReviewer />
        </ResumeReviewerErrorBoundary>
    );
}
