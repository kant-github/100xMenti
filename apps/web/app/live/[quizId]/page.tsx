'use client'

import { use } from "react"

interface PageProps {
    params: Promise<{
        quizId: string;
    }>;
}
export default function Home({ params }: PageProps) {
    const { quizId } = use(params)
    return (
        <div>
            {quizId}
        </div>
    )
}