'use client'
import Panels from "@/components/panels/Panels";
import { use, useState } from "react";

interface PageProps {
    params: Promise<{
        quizId: string;
    }>;
}

export default function Home({ params }: PageProps) {
    const { quizId } = use(params)
    return (
        <div>
            <Panels/>
        </div>
    );
}
