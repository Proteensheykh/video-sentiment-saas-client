"use client"

import { useState } from "react"
import UploadVideo from "./upload-video"

const EMOTION_EMOJI: Record<string, string> = {
    anger: "😡",
    disgust: "🤢",
    fear: "😨",
    joy: "☺️",
    neutral: "😐",
    sadness: "😢",
    suprise: "😯"
}

const SENTIMENT_EMOJI: Record<string, string> = {
    negative: "😟",
    neutral: "😐",
    positive: "😊"
}

interface InferenceProps {
    quota: {
        secretKey: string
    }
}

export type Analysis = {
    analysis: {
        utterances: Array<{
            start_time: number
            end_time: number
            text: string
            emotions: Array<{ label: string, confidence: number }>
            sentiments: Array<{ label: string, confidence: number }>
        }>
    }
}

export function Inference({ quota }: InferenceProps) {
    const [analysis, setAnalysis] = useState<Analysis | null>({
        analysis: {
            utterances: [
                {
                    start_time: 0,
                    end_time: 2.5,
                    text: "I'm really excited about this new project!",
                    emotions: [
                        { label: "joy", confidence: 0.85 },
                        { label: "neutral", confidence: 0.10 },
                        { label: "suprise", confidence: 0.05 }
                    ],
                    sentiments: [
                        { label: "positive", confidence: 0.90 },
                        { label: "neutral", confidence: 0.10 }
                    ]
                },
                {
                    start_time: 2.5,
                    end_time: 5.0,
                    text: "But I'm a bit worried about the deadline.",
                    emotions: [
                        { label: "fear", confidence: 0.65 },
                        { label: "neutral", confidence: 0.25 },
                        { label: "sadness", confidence: 0.10 }
                    ],
                    sentiments: [
                        { label: "negative", confidence: 0.70 },
                        { label: "neutral", confidence: 0.30 }
                    ]
                },
                {
                    start_time: 5.0,
                    end_time: 7.5,
                    text: "However, I think we can make it work together.",
                    emotions: [
                        { label: "neutral", confidence: 0.60 },
                        { label: "joy", confidence: 0.30 },
                        { label: "suprise", confidence: 0.10 }
                    ],
                    sentiments: [
                        { label: "positive", confidence: 0.75 },
                        { label: "neutral", confidence: 0.25 }
                    ]
                }
            ]
        }
    })

    const getAverageScores = () => {
        if (!analysis?.analysis.utterances.length) return null

        // aggregate scores
        const emotionScores: Record<string, number[]> = {}
        const sentimentScores: Record<string, number[]> = {}

        analysis?.analysis.utterances.forEach((utterance) => {

            utterance.emotions.forEach((emotion) => {
                if (!emotionScores[emotion.label]) emotionScores[emotion.label] = []
                emotionScores[emotion.label]!.push(emotion.confidence)
            });

            utterance.sentiments.forEach((sentiment) => {
                if (!sentimentScores[sentiment.label]) sentimentScores[sentiment.label] = []
                sentimentScores[sentiment.label]!.push(sentiment.confidence)
            });
        });

        // Calculate the average
        const avgEmotions = Object.entries(emotionScores).map(([label, scores]) => ({
            label,
            confidence: scores.reduce((a, b) => a + b, 0) / scores.length
        }))

        const avgSentiments = Object.entries(sentimentScores).map(([label, scores]) => ({
            label,
            confidence: scores.reduce((a, b) => a + b, 0) / scores.length
        }))

        // Get the top scoring emotion and sentiment
        const topEmotion = avgEmotions.sort((a, b) => b.confidence - a.confidence)[0]
        const topSentiment = avgSentiments.sort((a, b) => b.confidence - a.confidence)[0]

        return { topEmotion, topSentiment }
    }

    const averages = getAverageScores()
    return (
        <div className="flex h-fit w-full flex-col gap-3 md:w-1/2">
            <h2 className="text-lg font-medium text-slate-800">Inference</h2>
            <UploadVideo apiKey={quota.secretKey} onAnalysis={setAnalysis} />

            <h2 className="mt-2 text-sm text-slate-800">Overall analysis</h2>
            {analysis ? (
                <div className="flex h-fit w-full flex-wrap items-center justify-center gap-4 rounded-xl border border-gray-200 p-4 sm:gap-8 sm:px-6">
                    <div className="flex flex-col items-center">
                        <span className="text-sm">Primary emotion</span>
                        <span className="text-[40px]">{EMOTION_EMOJI[averages?.topEmotion?.label!]}</span>
                        <span className="text-sm text-gray-500">{averages?.topEmotion?.confidence.toFixed(3)} ({(averages?.topEmotion?.confidence! * 100).toFixed(0)}%)</span>
                        <span className="text-sm">{averages?.topEmotion?.label}</span>
                    </div>

                    <div className="flex flex-col items-center">
                        <span className="text-sm">Primary sentiment</span>
                        <span className="text-[40px]">{SENTIMENT_EMOJI[averages?.topSentiment?.label!]}</span>
                        <span className="text-sm text-gray-500">{averages?.topSentiment?.confidence.toFixed(3)} ({(averages?.topSentiment?.confidence! * 100).toFixed(0)}%)</span>
                        <span className="text-sm">{averages?.topSentiment?.label}</span>
                    </div>
                </div>
            ) : (
                <div className="flex h-32 w-full items-center justify-center rounded-xl border border-dashed border-gray-200 p-4">
                    <span className="text-sm text-gray-400">
                        Upload a video to see analysis.
                    </span>
                </div>
            )
            }

            <h2 className="mt-2 text-sm text-slate-800">Analysis Of Utterances</h2>
            {analysis ? (
                <div className="flex max-h-[300px] w-full overflow-y-auto flex-col gap-2">
                    {analysis?.analysis.utterances.map((utterance, i) => {
                        return (
                            <div
                                key={utterance.start_time.toString() + utterance.end_time.toString()}
                                className="flex h-fit w-full justify-between gap-8 rounded-xl border border-gray-100 bg-gray-100 px-6 py-4 sm:gap-4"
                            >
                                {/* Time and text */}
                                <div className="flex w-full max-w-24 flex-col justify-center">
                                    <div className="text-sm font-semibold">
                                        ⏱️ {Number(utterance.start_time).toFixed(1)} - {Number(utterance.end_time).toFixed(1)}
                                    </div>
                                    <div className="mt-1 text-xs text-gray-500">
                                        {utterance.text}
                                    </div>
                                </div>

                                {/* Emotions */}
                                <div className="flex w-full max-w-48 flex-col gap-2">
                                    <span className="text-sm font-medium">Emotions</span>
                                    {utterance.emotions.map((emo, i) => {
                                        return (
                                            <div key={emo.label}>
                                                <span className="text-xs w-16 whitespace-nowrap text-gray-500">
                                                    {EMOTION_EMOJI[emo.label]} {emo.label}
                                                </span>
                                                {/* Progress bar */}
                                                <div className="flex-1">
                                                    <div className="h-1 w-full rounded-full bg-gray-100">
                                                        <div style={{ width: `${emo.confidence * 100}%` }} className="h-1 rounded-full bg-gray-800"></div>
                                                    </div>
                                                </div>
                                                <span className="w-8 text-xs">{(emo.confidence) * 100}%</span>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Sentiments */}
                                <div className="flex w-full max-w-48 flex-col gap-2">
                                    <span className="text-sm font-medium">Setiments</span>
                                    {utterance.sentiments.map((sentiment, i) => {
                                        return (
                                            <div key={sentiment.label}>
                                                <span className="text-xs w-16 whitespace-nowrap text-gray-500">
                                                    {SENTIMENT_EMOJI[sentiment.label]} {sentiment.label}
                                                </span>
                                                {/* Progress bar */}
                                                <div className="flex-1">
                                                    <div className="h-1 w-full rounded-full bg-gray-100">
                                                        <div style={{ width: `${sentiment.confidence * 100}%` }} className="h-1 rounded-full bg-gray-800"></div>
                                                    </div>
                                                </div>
                                                <span className="w-8 text-xs">{(sentiment.confidence) * 100}%</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="flex h-32 w-full items-center justify-center rounded-xl border border-dashed border-gray-200 p-4">
                    <span className="text-sm text-gray-400">
                        Upload a video to see analysis results.
                    </span>
                </div>
            )}
        </div>
    )
}