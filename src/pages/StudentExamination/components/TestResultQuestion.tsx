import React from 'react';
import { QuizResultQuestion } from 'resources/student/QuizResultQuestion';
import { Col, Row } from 'react-bootstrap';
import { MarkdownRenderer } from 'components/MarkdownRenderer/MarkdownRenderer';
import { QuizQuestionCard } from 'components/QuizQuestionCard';
import { IsCorrect } from 'components/IsCorrect';

type Props = {
    question: QuizResultQuestion
}

export function TestResultQuestion({ question }: Props) {
    return (
        <QuizQuestionCard text={question.questionText}>
            <Row>
                <Col sm={10}>
                    <MarkdownRenderer source={question.answerText} />
                </Col>
                <Col sm={2} className="d-flex justify-content-end">
                    <IsCorrect value={question.isCorrect} showText />
                </Col>
            </Row>
        </QuizQuestionCard>
    );
}
